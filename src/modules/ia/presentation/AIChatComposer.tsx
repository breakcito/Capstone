import { useRef, useState } from "react";
import {
  PaperClipIcon,
  ArrowUpIcon,
  StopIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useUIStore } from "../../../stores/ui.store";
import { useIAStore } from "../store/ia.store";
import type { Adjunto } from "../types";

const MAX_ADJUNTOS = 5;
const MAX_MB = 10;

const EXTENSION_POR_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
};

/** Al pegar un screenshot el File.name viene vacío: se deriva del MIME. */
const nombreDesdeMime = (mime: string) => {
  const extension = EXTENSION_POR_MIME[mime] ?? "bin";
  return `imagen.${extension}`;
};

export const AIChatComposer = ({
  onEnviar,
  onDetener,
}: {
  onEnviar: (texto: string) => void;
  onDetener: () => void;
}) => {
  const [texto, setTexto] = useState("");
  const [arrastrando, setArrastrando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { adjuntos, cargando, agregarAdjunto, quitarAdjunto } = useIAStore();

  /** Convierte un File en base64, conservando el data URL para previsualizar. */
  const registrarArchivo = (file: File): Promise<Adjunto> =>
    new Promise((resolve, reject) => {
      const lector = new FileReader();

      lector.onerror = () => reject(new Error(`No se pudo leer ${file.name}`));
      lector.onload = () => {
        const dataUrl = String(lector.result ?? "");
        const mime = file.type || "application/octet-stream";
        const nombre = file.name || nombreDesdeMime(mime);

        resolve({
          nombre,
          mime,
          base64: dataUrl.split(",")[1] ?? "",
          previewUrl: dataUrl,
          tamano: file.size,
        });
      };

      lector.readAsDataURL(file);
    });

  const agregar = async (files: FileList | File[]) => {
    const lista = Array.from(files);

    if (useIAStore.getState().adjuntos.length + lista.length > MAX_ADJUNTOS) {
      useUIStore.getState().notify({
        type: "error",
        content: `Puedes adjuntar hasta ${MAX_ADJUNTOS} archivos por mensaje.`,
      });
      return;
    }

    for (const file of lista) {
      if (file.size > MAX_MB * 1024 * 1024) {
        useUIStore.getState().notify({
          type: "error",
          content: `"${file.name}" pesa ${(file.size / 1024 / 1024).toFixed(1)} MB y el límite es ${MAX_MB} MB.`,
        });
        continue;
      }

      agregarAdjunto(await registrarArchivo(file));
    }
  };

  const enviar = () => {
    if (cargando) return;
    if (!texto.trim() && adjuntos.length === 0) return;

    onEnviar(texto);
    setTexto("");
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setArrastrando(true);
      }}
      onDragLeave={() => setArrastrando(false)}
      onDrop={(e) => {
        e.preventDefault();
        setArrastrando(false);
        if (e.dataTransfer.files.length > 0) agregar(e.dataTransfer.files);
      }}
      className={`border-t border-white/8 p-3 transition-colors ${
        arrastrando ? "bg-violet-600/10" : ""
      }`}
    >
      {/* Vista previa de adjuntos */}
      {adjuntos.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {adjuntos.map((adjunto) => (
            <div
              key={`${adjunto.nombre}-${adjunto.base64.length}`}
              className="relative group"
            >
              {adjunto.mime.startsWith("image/") ? (
                <img
                  src={adjunto.previewUrl}
                  alt={adjunto.nombre}
                  className="w-14 h-14 rounded-xl object-cover ring-1 ring-white/15"
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-xl bg-white/5 ring-1 ring-white/15 flex items-center
                    justify-center text-[9px] font-bold text-zinc-400 uppercase"
                >
                  {adjunto.nombre.split(".").pop()?.slice(0, 4)}
                </div>
              )}

              <button
                onClick={() => quitarAdjunto(adjunto.nombre)}
                aria-label={`Quitar ${adjunto.nombre}`}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-zinc-800
                  ring-1 ring-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100
                  transition-opacity hover:bg-red-500/30"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          aria-label="Adjuntar archivo"
          className="p-2.5 text-zinc-400 hover:text-white transition-all duration-200
            hover:bg-white/10 rounded-xl active:scale-95"
        >
          <PaperClipIcon className="w-5 h-5" />
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files?.length) agregar(e.target.files);
            e.target.value = "";
          }}
        />

        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onPaste={(e) => {
            // Pegar un archivo o un screenshot: no pasa por el input de archivos.
            const archivos = Array.from(e.clipboardData.items)
              .filter((item) => item.kind === "file")
              .map((item) => item.getAsFile())
              .filter((f): f is File => f !== null);

            if (archivos.length > 0) {
              e.preventDefault();
              agregar(archivos);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              enviar();
            }
          }}
          rows={1}
          placeholder="Pregunta sobre inventario, kardex, pedidos o KPIs…"
          className="flex-1 resize-none bg-white/5 ring-1 ring-white/10 rounded-xl px-3 py-2.5
            text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:ring-violet-500/50
            transition-shadow max-h-32 min-h-[42px]"
          style={{ height: "auto" }}
          onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${Math.min(e.currentTarget.scrollHeight, 128)}px`;
          }}
        />

        {cargando ? (
          <button
            onClick={onDetener}
            aria-label="Detener"
            className="p-2.5 rounded-xl bg-red-500/20 ring-1 ring-red-500/30 text-red-300
              hover:bg-red-500/30 transition-all active:scale-95"
          >
            <StopIcon className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={enviar}
            disabled={!texto.trim() && adjuntos.length === 0}
            aria-label="Enviar"
            className="p-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-500
              transition-all duration-200 active:scale-95 disabled:opacity-30
              disabled:hover:bg-violet-600"
          >
            <ArrowUpIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {arrastrando && (
        <p className="mt-2 text-center text-xs text-violet-300">
          Suelta los archivos aquí
        </p>
      )}
    </div>
  );
};