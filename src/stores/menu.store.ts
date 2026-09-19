import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RES_Menu } from "../service/responses/menu-navegacion";

export interface RES_MenuNavegacionStore {
  menu: RES_Menu[];
  updateMenu: (menu: RES_Menu[]) => void;
  clearMenu: () => void;
}

// Store para el menu de navegacion con persistencia
export const useMenuNavegacionStore = create<RES_MenuNavegacionStore>()(
  persist(
    (set) => ({
      menu: [],
      updateMenu: (menu) => set({ menu }),
      clearMenu: () => set({ menu: [] }),
    }),
    {
      name: "blacksilver-menu", // nombre en localStorage
    },
  ),
);

// Listener para sincronización entre pestañas
window.addEventListener("storage", (event) => {
  if (event.key === "blacksilver-menu") {
    if (event.newValue) {
      // Si hay un nuevo valor de menú, intenta sincronizar
      useMenuNavegacionStore.persist.rehydrate();
    } else {
      // Si el valor fue eliminado/vaciado, hace clear del menu
      useMenuNavegacionStore.getState().clearMenu();
    }
  }
});
