import { useState } from "react";
import {
  SparklesIcon,
  ArrowDownTrayIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { api } from "../../../service/_api";
import { useUIStore } from "../../../stores/ui.store";
import { Markdown } from "./Markdown";
import type { MensajeIA } from "../types";

interface Props {
  mensaje: MensajeIA;
  /** El spinner del cursor solo gira mientras la respuesta sigue viva. */
  transmitiendo: boolean;
}

/** Formato legible para tamano de archivo (B, KB, MB). */
const formatearBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

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
          className={`px-4 py-3 rounded-3xl ${
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

        {/* Descarga del PDF generado. */}
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
              : `${mensaje.archivo.nombre}${formatearBytes(mensaje.archivo.bytes) ? ` · ${formatearBytes(mensaje.archivo.bytes)}` : ""}`}
            {!descargando && <CheckIcon className="w-3.5 h-3.5 opacity-60" />}
          </button>
        )}
      </div>
    </div>
  );
};