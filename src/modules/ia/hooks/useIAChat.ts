import { useCallback, useRef } from "react";
import { useAuthStore } from "../../../stores/auth.store";
import { useUIStore } from "../../../stores/ui.store";
import { useIAStore, nuevoId } from "../store/ia.store";
import type { Adjunto, MensajeAPI, ToolCall } from "../types";

/**
 * Envia la conversacion y consume el stream SSE del backend.
 *
 * NO se usa axios: para leer el ReadableStream de la respuesta hace falta
 * fetch nativo. El token se inyecta a mano porque este endpoint no pasa por
 * los interceptores de `src/service/_api.ts`.
 *
 * IMPORTANTE: el historial viaja completo en cada request (stateless), por
 * lo que preservamos los `tool_calls` del assistant y los mensajes `tool`
 * con su `tool_call_id`. Si se aplanara a `{role, content}` y se tiraran,
 * el modelo perderia el contexto de los reportes previos en una conversacion
 * larga y responderia cosas como "ya te lo envie antes".
 */
export const useIAChat = () => {
  const abortRef = useRef<AbortController | null>(null);

  const detener = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    useIAStore.getState().setCargando(false);
  }, []);

  const enviar = useCallback(async (texto: string) => {
    const store = useIAStore.getState();
    const token = useAuthStore.getState().token;

    if ((!texto.trim() && store.adjuntos.length === 0) || store.cargando) {
      return;
    }

    const adjuntos: Adjunto[] = store.adjuntos;
    const idRespuesta = nuevoId();

    // El mensaje del usuario se pinta de inmediato, con sus adjuntos.
    store.agregarMensaje({
      id: nuevoId(),
      rol: "user",
      texto: texto.trim(),
      adjuntos: adjuntos.length > 0 ? adjuntos : undefined,
    });

    store.agregarMensaje({ id: idRespuesta, rol: "assistant", texto: "" });
    store.limpiarAdjuntos();
    store.setCargando(true);

    // El backend es stateless: se reenvia la conversacion completa con la
    // cadena de tool_calls y los mensajes `tool` que el modelo necesite ver
    // para tener continuidad entre turnos.
    const historial: MensajeAPI[] = serializarHistorial(idRespuesta);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const respuesta = await fetch(
        `${import.meta.env.VITE_API_URL}/ia/chat/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
          body: JSON.stringify({
            messages: historial,
            adjuntos: adjuntos.map((a) => ({
              nombre: a.nombre,
              mime: a.mime,
              base64: a.base64,
            })),
          }),
        },
      );

      // Un 401/403/422 llega como JSON, no como stream. Hay que distinguirlo
      // antes de leer el body o el chat se queda con el spinner girando.
      if (!respuesta.ok) {
        const cuerpo = await respuesta.json().catch(() => null);
        throw new Error(
          cuerpo?.message || `Error ${respuesta.status} al consultar al asistente.`,
        );
      }

      if (!respuesta.body) {
        throw new Error("El navegador no entrego el stream de respuesta.");
      }

      const lector = respuesta.body.getReader();
      const decodificador = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await lector.read();

        if (done) break;

        buffer += decodificador.decode(value, { stream: true });

        // Los eventos SSE se separan por una linea en blanco.
        let corte = buffer.indexOf("\n\n");

        while (corte !== -1) {
          const bloque = buffer.slice(0, corte);
          buffer = buffer.slice(corte + 2);

          aplicarEvento(bloque, idRespuesta);
          corte = buffer.indexOf("\n\n");
        }
      }
    } catch (error) {
      const esCancelacion = error instanceof DOMException && error.name === "AbortError";

      if (esCancelacion) {
        // El usuario detuvo la generacion: lo ya escrito se conserva.
        return;
      }

      useIAStore.getState().actualizarMensaje(idRespuesta, {
        texto:
          useIAStore.getState().mensajes.find((m) => m.id === idRespuesta)?.texto ||
          "No pude comunicarme con el asistente.",
        error: true,
      });

      useUIStore.getState().notify({
        type: "error",
        content: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      abortRef.current = null;
      useIAStore.getState().setCargando(false);
      defensivaPostFin(idRespuesta);
    }
  }, []);

  return { enviar, detener };
};

/**
 * Serializa el historial de la conversacion al formato que espera el
 * backend (OpenAI-compat).
 *
 * Reglas:
 *  - Mensajes `tool` siempre van, aunque tengan content vacio: el backend
 *    los necesita para encadenar el siguiente turno.
 *  - Mensajes `assistant` con `tool_calls` se envian aunque su texto este
 *    vacio: las llamadas a herramientas son el contenido.
 *  - Mensajes `user` o `assistant` sin tool_calls y con texto vacio se
 *    descartan (compactacion visual pero no rompen el formato).
 */
const serializarHistorial = (idRespuesta: string): MensajeAPI[] => {
  return useIAStore
    .getState()
    .mensajes
    .filter((m) => m.id !== idRespuesta)
    .filter((m) => {
      if (m.rol === "tool") return true;
      if (m.rol === "assistant" && (m.tool_calls?.length ?? 0) > 0) return true;
      return m.texto.trim() !== "";
    })
    .map((m): MensajeAPI => {
      if (m.rol === "tool") {
        return {
          role: "tool",
          content: m.texto,
          tool_call_id: m.tool_call_id ?? "",
          name: m.herramienta?.nombre ?? "",
        };
      }
      if (m.rol === "assistant" && (m.tool_calls?.length ?? 0) > 0) {
        return {
          role: "assistant",
          content: m.texto,
          tool_calls: m.tool_calls,
        };
      }
      return { role: m.rol, content: m.texto };
    });
};

/**
 * Despues de que el stream termina (con o sin error), si el modelo pidio
 * generar un PDF pero por algun motivo no llego el evento `archivo`,
 * marcamos el mensaje como incompleto para que la UI muestre la accion
 * correcta en lugar de un "Listo..." enganado.
 */
const defensivaPostFin = (idRespuesta: string): void => {
  const store = useIAStore.getState();
  const mensaje = store.mensajes.find((m) => m.id === idRespuesta);

  if (!mensaje || mensaje.error || mensaje.archivo) return;

  const pidioReporte = (mensaje.tool_calls ?? []).some(
    (c) => c.nombre === "generar_reporte_pdf",
  );

  if (!pidioReporte) return;

  store.actualizarMensaje(idRespuesta, {
    texto:
      (mensaje.texto ?? "").trim().length > 0
        ? mensaje.texto +
          "\n\nNo pude generar el archivo del reporte. Pidelo de nuevo y lo armo."
        : "No pude generar el archivo del reporte. Pidelo de nuevo y lo armo.",
    error: true,
  });

  useUIStore.getState().notify({
    type: "error",
    content: "El asistente no entrego el archivo. Vuelve a pedirlo.",
  });
};

/**
 * Traduce un bloque SSE a una actualizacion del store.
 *
 * Se despacha por el NOMBRE del evento, no por un campo del payload: asi el
 * backend puede anadir tipos nuevos sin romper este cliente.
 */
const aplicarEvento = (bloque: string, idRespuesta: string) => {
  let evento = "";
  let datos = "{}";

  for (const linea of bloque.split("\n")) {
    const limpia = linea.trim();
    if (limpia.startsWith("event:")) evento = limpia.slice(6).trim();
    if (limpia.startsWith("data:")) datos = limpia.slice(5).trim();
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(datos);
  } catch {
    return;
  }

  const store = useIAStore.getState();
  const mensaje = store.mensajes.find((m) => m.id === idRespuesta);

  switch (evento) {
    case "texto": {
      const trozo = String(payload.texto ?? "");
      store.actualizarMensaje(idRespuesta, {
        texto: (mensaje?.texto ?? "") + trozo,
      });
      break;
    }

    case "razonamiento": {
      const trozo = String(payload.texto ?? "");
      store.actualizarMensaje(idRespuesta, {
        razonamiento: (mensaje?.razonamiento ?? "") + trozo,
      });
      break;
    }

    case "tool_call": {
      // El modelo decidio llamar a una herramienta. Lo guardamos en el
      // mensaje del assistant para reenviarlo en el siguiente turno.
      const nuevo: ToolCall = {
        id: String(payload.id ?? ""),
        nombre: String(payload.nombre ?? ""),
        argumentos: String(payload.argumentos ?? ""),
      };
      const existentes = mensaje?.tool_calls ?? [];
      // Deduplicar por id (el backend podria reenviar el mismo evento).
      if (existentes.some((t) => t.id === nuevo.id && nuevo.id !== "")) break;
      store.actualizarMensaje(idRespuesta, {
        tool_calls: [...existentes, nuevo],
      });
      break;
    }

    case "tool_result": {
      // El backend ya ejecuto la herramienta: persistimos un mensaje
      // `tool` con su tool_call_id para que el siguiente turno del modelo
      // vea el resultado en la posicion correcta del historial.
      const toolCallId = String(payload.tool_call_id ?? "");
      const contenido = String(payload.content ?? "");
      const nombre = String(payload.nombre ?? "");
      const estado = payload.estado === "error" ? "error" : "ok";

      if (toolCallId === "") break;

      store.agregarMensaje({
        id: nuevoId(),
        rol: "tool",
        texto: contenido,
        tool_call_id: toolCallId,
        herramienta: { nombre, estado, preview: "" },
      });
      break;
    }

    case "tool": {
      // Evento de estado (ok/error) compatible con la version anterior.
      // La UI no muestra nada de esto: queda reservado para logs.
      store.actualizarMensaje(idRespuesta, {
        herramienta: {
          nombre: String(payload.nombre ?? ""),
          estado: payload.estado === "error" ? "error" : "ok",
          preview: String(payload.preview ?? ""),
        },
      });
      break;
    }

    case "archivo": {
      store.actualizarMensaje(idRespuesta, {
        archivo: {
          uuid: String(payload.uuid ?? ""),
          nombre: String(payload.nombre ?? "reporte.pdf"),
          bytes: Number(payload.bytes ?? 0),
        },
      });
      break;
    }

    case "aviso": {
      useUIStore.getState().notify({
        type: "info",
        content: String(payload.mensaje ?? ""),
      });
      break;
    }

    case "error": {
      store.actualizarMensaje(idRespuesta, {
        texto:
          (mensaje?.texto ?? "") +
          (mensaje?.texto ? "\n\n" : "") +
          `No pude completar la consulta: ${String(payload.mensaje ?? "error desconocido")}`,
        error: true,
      });
      break;
    }

    case "fin":
      store.setCargando(false);
      break;
  }
};
