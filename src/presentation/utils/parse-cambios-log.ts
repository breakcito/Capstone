import type { RES_CambiosLog } from "../../service/responses/_generic/cambios-log";

/**
 * Parseo defensivo del campo cambios_log que puede llegar como array o JSON string
 * (MySQL via DB::select() lo devuelve como string).
 */
export const parseCambiosLog = (raw: unknown): RES_CambiosLog[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as RES_CambiosLog[];
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as RES_CambiosLog[]) : [];
    } catch {
      return [];
    }
  }
  return [];
};
