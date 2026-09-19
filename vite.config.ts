import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: ["colorthief"],
  },
  build: {
    target: "esnext",
    sourcemap: false, // Desactiva generación de sourcemaps para liberar memoria RAM
    chunkSizeWarningLimit: 5000,
  },
});
