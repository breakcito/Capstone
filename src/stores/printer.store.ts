import { create } from "zustand";
import type { ReactElement } from "react";

export interface PrintConfig {
  documentTitle?: string;
  target?: string;
  onAfterPrint?: () => void | Promise<void>;
}

export interface PrintJob {
  id: string;
  /** Debe ser un Document de react-pdf/renderer */
  document: ReactElement;
  config: PrintConfig;
}

interface PrinterState {
  jobs: PrintJob[];
  enqueuePrint: (document: ReactElement, config?: PrintConfig) => void;
  dequeueJob: (id: string) => void;
}

export const usePrinterStore = create<PrinterState>((set) => ({
  jobs: [],
  enqueuePrint: (document, config = {}) => {
    set((state) => ({
      jobs: [...state.jobs, { id: crypto.randomUUID(), document, config }],
    }));
  },
  dequeueJob: (id) => {
    set((state) => ({ jobs: state.jobs.filter((j) => j.id !== id) }));
  },
}));
