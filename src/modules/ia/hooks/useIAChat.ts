import { useCallback, useRef } from "react";
import { useAuthStore } from "../../../stores/auth.store";
import { useUIStore } from "../../../stores/ui.store";
import { useIAStore, nuevoId } from "../store/ia.store";
import type { Adjunto, MensajeAPI } from "../types";

/**
 * Envia la conversacion y consume el stream SSE del backend.
 *
 * NO se usa axios: para leer el ReadableStream de la respuesta hace falta
 * fetch nativo. El token se inyecta a mano porque este endpoint no pasa por
 * los interceptores de `src/service/_api.ts`.
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

    // El backend es stateless: se reenvia la conversacion completa.
    const historial: MensajeAPI[] = [
      ...useIAStore
        .getState()
        .mensajes.filter((m) => m.id !== idRespuesta)
        .filter((m) => m.texto.trim() !== "")
        .map((m) => ({ role: m.rol, content: m.texto })),
    ];

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
    }
  }, []);

  return { enviar, detener };
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

    case "tool": {
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
          nombre: String(payload.nombre ?? "reporte.xlsx"),
          filas: Number(payload.filas ?? 0),
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