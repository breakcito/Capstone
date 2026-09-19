import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IAuditoriaStore {
  en_modo_auditable: boolean;
  setModoAuditoria: (activo: boolean) => void;
}

/**
 * Store global para manejar el estado del Modo Auditoría.
 * Se persiste en localStorage para mantener el estado entre pestañas y recargas.
 */
export const useAuditoriaStore = create<IAuditoriaStore>()(
  persist(
    (set) => ({
      en_modo_auditable: false,

      setModoAuditoria: (activo: boolean) => {
        console.log(`[Store] Modo Auditoría -> ${activo}`);
        set({ en_modo_auditable: activo });
      },
    }),
    {
      name: "blacksilver-auditoria",
    },
  ),
);

// Sincronización entre pestañas nativa de Zustand persist
window.addEventListener("storage", (event) => {
  if (event.key === "blacksilver-auditoria") {
    useAuditoriaStore.persist.rehydrate();
  }
});
