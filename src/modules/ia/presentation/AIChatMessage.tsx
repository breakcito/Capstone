import { useState } from "react";
import {
  SparklesIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { api } from "../../../service/_api";
import { useUIStore } from "../../../stores/ui.store";
import { Markdown } from "./Markdown";
import type { MensajeIA } from "../types";

interface Props {
  mensaje: MensajeIA;
  /** El spinner de la herramienta solo gira mientras la respuesta sigue viva. */
  transmitiendo: boolean;
}

export const AIChatMessage = ({ mensaje, transmitiendo }: Props) => {
  const esUsuario = mensaje.rol === "user";
  const [descargando, setDescargando] = useState(false);

  /**
   * La descarga va por axios y no por un <a href> porque el endpoint exige el
   * header Authorization, que un enlace no puede mandar.
   */
  const descargar = async () => {
    if (!mensaje.archivo) return;

    setDescargando(true);

    try {
      const { data } = await api.get(`/ia/reporte/${mensaje.archivo.uuid}`, {
        responseType: "blob",
      });

      const url = URL.createObjectURL(data);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = mensaje.archivo.nombre;
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      URL.revokeObjectURL(url);
    } catch {
      useUIStore.getState().notify({
        type: "error",
        content: "No se pudo descargar el reporte. Vuelve a generarlo.",
      });
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className={`flex gap-3 ${esUsuario ? "justify-end" : "justify-start"}`}>
      {!esUsuario && (
        <div
          className="shrink-0 w-8 h-8 rounded-xl bg-linear-to-br from-violet-600/30
            to-blue-600/30 ring-1 ring-white/10 flex items-center justify-center"
        >
          <SparklesIcon className="w-4 h-4 text-violet-300" />
        </div>
      )}

      <div className={`max-w-[85%] min-w-0 ${esUsuario ? "items-end" : ""}`}>
        {/* Adjuntos del usuario */}
        {mensaje.adjuntos && mensaje.adjuntos.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-end mb-2">
            {mensaje.adjuntos.map((adjunto) => (
              <div
                key={adjunto.nombre}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg
                  bg-white/5 ring-1 ring-white/10 max-w-[220px]"
              >
                {adjunto.mime.startsWith("image/") ? (
                  <img
                    src={adjunto.previewUrl}
                    alt={adjunto.nombre}
                    className="w-8 h-8 rounded object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded bg-white/5 flex items-center justify-center
                      text-[9px] font-bold text-zinc-400 uppercase"
                  >
                    {adjunto.nombre.split(".").pop()?.slice(0, 4)}
                  </div>
                )}
                <span className="text-xs text-zinc-300 truncate">{adjunto.nombre}</span>
              </div>
            ))}
          </div>
        )}

        <div
          className={`px-4 py-3 rounded-2xl ${
            esUsuario
              ? "bg-violet-600/20 ring-1 ring-violet-500/25 text-zinc-100 text-sm leading-relaxed"
              : mensaje.error
                ? "bg-red-500/10 ring-1 ring-red-500/25 text-red-200 text-sm leading-relaxed whitespace-pre-wrap break-words"
                : "bg-white/5 ring-1 ring-white/10"
          }`}
        >
          {esUsuario ? (
            <span className="whitespace-pre-wrap break-words">{mensaje.texto}</span>
          ) : (
            <Markdown texto={mensaje.texto} />
          )}

          {/* Cursor mientras el texto llega */}
          {!esUsuario && !mensaje.error && mensaje.texto === "" && transmitiendo && (
            <span className="inline-block w-2 h-4 bg-violet-400/70 animate-pulse align-middle" />
          )}
        </div>

        {/* Herramienta que ejecuto el modelo */}
        {mensaje.herramienta && (
          <div className="mt-2 flex items-start gap-2 text-[11px] font-mono text-zinc-500">
            {mensaje.herramienta.estado === "error" ? (
              <ExclamationTriangleIcon className="w-3.5 h-3.5 text-red-400 shrink-0 mt-px" />
            ) : transmitiendo ? (
              <span className="w-3.5 h-3.5 shrink-0 mt-px rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            ) : (
              <CheckIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-px" />
            )}
            <span className={mensaje.herramienta.estado === "error" ? "text-red-400" : "text-emerald-400"}>
              {mensaje.herramienta.nombre}
            </span>
            <span className="truncate text-zinc-600">{mensaje.herramienta.preview}</span>
          </div>
        )}

        {/* Descarga del Excel generado */}
        {mensaje.archivo && (
          <button
            onClick={descargar}
            disabled={descargando}
            className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10
              ring-1 ring-emerald-500/25 text-xs text-emerald-300 hover:bg-emerald-500/20
              transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            {descargando
              ? "Preparando..."
              : `${mensaje.archivo.nombre} · ${mensaje.archivo.filas} filas`}
          </button>
        )}

        {/* Razonamiento plegado */}
        {mensaje.razonamiento && (
          <details className="mt-2 group">
            <summary className="cursor-pointer text-[11px] text-zinc-500 hover:text-zinc-400
              transition-colors select-none">
              ver razonamiento
            </summary>
            <div className="mt-2 p-3 rounded-xl bg-black/30 ring-1 ring-white/5 text-[11px]
              text-zinc-500 leading-relaxed whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
              {mensaje.razonamiento}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};