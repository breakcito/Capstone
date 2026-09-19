import { create } from "zustand";
import type { ExcelBuilderFn } from "../presentation/utils/excel/excel-utils";

export interface ExcelConfig {
  filename: string;
  builder: ExcelBuilderFn;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface ExcelJob {
  id: string;
  config: ExcelConfig;
}

interface ExcelState {
  jobs: ExcelJob[];
  enqueueJob: (config: ExcelConfig) => void;
  dequeueJob: (id: string) => void;
}

export const useExcelStore = create<ExcelState>((set) => ({
  jobs: [],
  enqueueJob: (config) => {
    set((state) => ({
      jobs: [...state.jobs, { id: crypto.randomUUID(), config }],
    }));
  },
  dequeueJob: (id) => {
    set((state) => ({ jobs: state.jobs.filter((j) => j.id !== id) }));
  },
}));
