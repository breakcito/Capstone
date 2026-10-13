import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  SparklesIcon,
  XMarkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useIAStore } from "../store/ia.store";
import { useIAChat } from "../hooks/useIAChat";
import { AIChatMessage } from "./AIChatMessage";
import { AIChatComposer } from "./AIChatComposer";

const ANCHO_MIN = 380;
const ANCHO_MAX_PORCENTAJE = 92;
const CLAVE_ANCHO = "capstone-ia-chat-ancho";

const ANCHO_INICIAL = () => {
  if (typeof window === "undefined") return 460;

  const guardado = Number(window.localStorage.getItem(CLAVE_ANCHO));

  if (!Number.isFinite(guardado) || guardado <= 0) return 460;

  return Math.min(Math.max(guardado, ANCHO_MIN), window.innerWidth * (ANCHO_MAX_PORCENTAJE / 100));
};

export const AIChat = () => {
  const { abierto, cerrar, limpiar, mensajes, cargando } = useIAStore();
  const { enviar, detener } = useIAChat();

  const [ancho, setAncho] = useState(ANCHO_INICIAL);
  const scrollRef = useRef<HTMLDivElement>(null);

  /** Arrastre del borde izquierdo para redimensionar. */
  const iniciarRedimension = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const inicioX = e.clientX;
      const anchoInicial = ancho;

      const mover = (ev: PointerEvent) => {
        const maximo = window.innerWidth * (ANCHO_MAX_PORCENTAJE / 100);
        const nuevo = Math.min(Math.max(anchoInicial - (ev.clientX - inicioX), ANCHO_MIN), maximo);
        setAncho(nuevo);
      };

      const soltar = () => {
        window.removeEventListener("pointermove", mover);
        window.removeEventListener("pointerup", soltar);
        document.body.style.userSelect = "";
      };

      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", mover);
      window.addEventListener("pointerup", soltar);
    },
    [ancho],
  );

  useEffect(() => {
    window.localStorage.setItem(CLAVE_ANCHO, String(ancho));
  }, [ancho]);

  // Cierra con Escape, igual que el resto de overlays de la app.
  useEffect(() => {
    if (!abierto) return;

    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };

    document.addEventListener("keydown", alPulsar);
    return () => document.removeEventListener("keydown", alPulsar);
  }, [abierto, cerrar]);

  // Sigue al final mientras llega el texto.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [mensajes, cargando]);

  return (
    <AnimatePresence>
      {abierto && (
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 32, stiffness: 320 }}
          style={{ width: ancho }}
          className="fixed top-0 right-0 h-screen z-50 flex flex-col bg-zinc-950/80
            backdrop-blur-3xl border-l border-white/10 shadow-[-20px_0_60px_rgba(0,0,0,0.6)]"
        >
          {/* Handle de redimension */}
          <div
            onPointerDown={iniciarRedimension}
            role="separator"
            aria-label="Redimensionar panel"
            className="absolute left-0 top-0 h-full w-1.5 cursor-col-resize
              hover:bg-violet-500/40 transition-colors z-10"
          />

          {/* Header */}
          <header className="flex items-center justify-between gap-2 px-4 py-4 border-b border-white/8">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-xl bg-linear-to-br from-violet-600/30 to-blue-600/30
                  ring-1 ring-white/10 flex items-center justify-center shrink-0"
              >
                <SparklesIcon className="w-4 h-4 text-violet-300" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-white/90 leading-tight">
                  Asistente IA
                </h2>
                <p className="text-[11px] text-zinc-500 truncate">
                  Inventario · Kardex · Pedidos · KPIs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={limpiar}
                disabled={mensajes.length === 0}
                aria-label="Nueva conversación"
                className="p-2 text-zinc-400 hover:text-white transition-all duration-200
                  hover:bg-white/10 rounded-xl active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
              <button
                onClick={cerrar}
                aria-label="Cerrar asistente"
                className="p-2 text-zinc-400 hover:text-white transition-all duration-200
                  hover:bg-white/10 rounded-xl active:scale-95"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Mensajes */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {mensajes.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6 gap-3">
                <SparklesIcon className="w-8 h-8 text-violet-400/60" />
                <p className="text-sm text-zinc-400">
                  Pregúntame sobre tu inventario, el kardex, los pedidos de almacén o los KPIs.
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-1">
                  {[
                    "¿Qué productos están bajo stock mínimo?",
                    "Exporta un Excel con las alertas de stock",
                    "¿Cómo viene el TAP por almacén?",
                  ].map((sugerencia) => (
                    <button
                      key={sugerencia}
                      onClick={() => enviar(sugerencia)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 ring-1 ring-white/10 text-[11px]
                        text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                    >
                      {sugerencia}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              mensajes.map((mensaje, indice) => (
                <AIChatMessage
                  key={mensaje.id}
                  mensaje={mensaje}
                  // Solo el ultimo mensaje en curso gira: al llegar el evento
                  // "fin" la respuesta ya esta cerrada y el spinner se congela.
                  transmitiendo={cargando && indice === mensajes.length - 1}
                />
              ))
            )}
          </div>

          <AIChatComposer onEnviar={enviar} onDetener={detener} />
        </motion.aside>
      )}
    </AnimatePresence>
  );
};