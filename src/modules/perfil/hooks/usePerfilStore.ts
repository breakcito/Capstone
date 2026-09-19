import { create } from 'zustand';
import type { RES_Perfil } from '../service/perfil.responses';

interface PerfilState {
    perfil: RES_Perfil | null;
    loading: boolean;
    setPerfil: (perfil: RES_Perfil | null) => void;
    setLoading: (val: boolean) => void;
    reset: () => void;
}

export const usePerfilStore = create<PerfilState>((set) => ({
    perfil: null,
    loading: false,
    setPerfil: (perfil) => set({ perfil }),
    setLoading: (loading) => set({ loading }),
    reset: () => set({ perfil: null, loading: false }),
}));
