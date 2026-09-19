import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  RES_Login,
  RES_Usuario,
} from "../modules/login/service/login.responses";

export interface IAuthStore {
  token: string;
  usuario: RES_Usuario | null;
  isAuthenticated: boolean;
  updateAuth: (auth: RES_Login) => void;
  clearAuth: () => void;
}

// Store para conservar la informacion de la sesion en localStorage
export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      token: "",
      usuario: null,
      isAuthenticated: false,

      updateAuth: (auth: RES_Login) =>
        set({
          token: auth.token,
          usuario: auth.usuario,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          token: "",
          usuario: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "blacksilver-auth",
    },
  ),
);

// Listener para sincronización entre pestañas
window.addEventListener("storage", (event) => {
  if (event.key === "blacksilver-auth") {
    if (event.newValue) {
      // Si hay un nuevo valor, intenta sincronizar (e.g., login en otra pestaña)
      useAuthStore.persist.rehydrate();
    } else {
      // Si el valor fue eliminado/vaciado, hace clear de la auth (e.g., logout/clear en otra pestaña)
      useAuthStore.getState().clearAuth();
    }
  }
});
