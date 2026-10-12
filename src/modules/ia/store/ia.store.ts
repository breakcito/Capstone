import { create } from "zustand";
import type { Adjunto, MensajeIA } from "../types";

interface IAState {
  abierto: boolean;
  mensajes: MensajeIA[];
  cargando: boolean;
  adjuntos: Adjunto[];

  abrir: () => void;
  cerrar: () => void;
  limpiar: () => void;

  agregarMensaje: (mensaje: MensajeIA) => void;
  actualizarMensaje: (id: string, patch: Partial<MensajeIA>) => void;
  setCargando: (cargando: boolean) => void;

  agregarAdjunto: (adjunto: Adjunto) => void;
  quitarAdjunto: (nombre: string) => void;
  limpiarAdjuntos: () => void;
}

/**
 * El historial vive solo en memoria: si el usuario recarga, la conversacion
 * se pierde. Es la decision consciente de no crear tablas para esto.
 */
export const useIAStore = create<IAState>()((set) => ({
  abierto: false,
  mensajes: [],
  cargando: false,
  adjuntos: [],

  abrir: () => set({ abierto: true }),
  cerrar: () => set({ abierto: false }),
  limpiar: () => set({ mensajes: [], adjuntos: [], cargando: false }),

  agregarMensaje: (mensaje) =>
    set((state) => ({ mensajes: [...state.mensajes, mensaje] })),

  actualizarMensaje: (id, patch) =>
    set((state) => ({
      mensajes: state.mensajes.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    })),

  setCargando: (cargando) => set({ cargando }),

  agregarAdjunto: (adjunto) => set((state) => ({ adjuntos: [...state.adjuntos, adjunto] })),
  quitarAdjunto: (nombre) =>
    set((state) => ({ adjuntos: state.adjuntos.filter((a) => a.nombre !== nombre) })),
  limpiarAdjuntos: () => set({ adjuntos: [] }),
}));

export const nuevoId = () => crypto.randomUUID();