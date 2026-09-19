import { motion, AnimatePresence } from "framer-motion";
import { BlackcitoAssets } from "../assets/blackcito/blackcito-assets";
import type { BlackcitoEmotion } from "../assets/blackcito/blackcito-assets"; // <--- Importación de tipo arreglada

interface Props {
  emotion: BlackcitoEmotion;
  message?: string;
  onClose?: () => void;
  visible?: boolean;
}

export const BlackcitoMascot = ({
  emotion,
  message,
  onClose,
  visible = true,
}: Props) => {
  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed bottom-4 right-4 z-9999 flex flex-col items-end pointer-events-none">
          {" "}
          {/* <--- z-index arreglado */}
          {/* Burbuja de Mensaje */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="relative mb-3 mr-6 px-4 py-3 max-w-[250px] bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-2xl shadow-xl pointer-events-auto"
            >
              <p className="text-zinc-100 text-sm font-medium leading-relaxed">
                {message}
              </p>

              {/* Triangulito de la burbuja */}
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-zinc-900/80 border-r border-b border-zinc-700/50 rotate-45 transform" />
            </motion.div>
          )}
          {/* Personaje (Video) */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="relative w-28 h-28 pointer-events-auto cursor-pointer"
            onClick={onClose}
          >
            <video
              key={emotion}
              src={BlackcitoAssets[emotion]}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
