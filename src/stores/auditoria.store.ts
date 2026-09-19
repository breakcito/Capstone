import { create } from "zustand";

interface AuditoriaState {
  en_modo_auditable: boolean;
  setEnModoAuditable: (val: boolean) => void;
  toggleModoAuditable: () => void;
}

export const useAuditoriaStore = create<AuditoriaState>((set) => ({
  en_modo_auditable: false,
  setEnModoAuditable: (val: boolean) => set({ en_modo_auditable: val }),
  toggleModoAuditable: () =>
    set((state) => ({ en_modo_auditable: !state.en_modo_auditable })),
}));
