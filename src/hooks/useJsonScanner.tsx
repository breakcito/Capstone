import { useState, useCallback } from "react";

/**
 * Extrae valores de campos específicos desde texto crudo de un QR.
 * Tolera JSON roto, caracteres extraños y codificaciones fallidas.
 * Devuelve un objeto con el valor encontrado para cada campo solicitado (o "" si no encontró).
 */
export function parseQrFields(
  raw: string,
  fields: string[],
): Record<string, string> {
  const result: Record<string, string> = {};
  fields.forEach((f) => (result[f] = ""));

  if (!raw || !raw.trim()) return result;

  // 1. Intento directo: JSON válido
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      fields.forEach((f) => {
        if (f in parsed && parsed[f] !== undefined && parsed[f] !== null) {
          result[f] = String(parsed[f]);
        }
      });
      return result;
    }
  } catch {
    // JSON roto — continua con heurísticas
  }

  // 2. Parseo heurístico: buscar "campo":valor o "campo" : "valor" en texto corrupto
  fields.forEach((field) => {
    const quoted = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patterns = [
      new RegExp(`["']${quoted}["']\\s*:\\s*["']([^"']+)["']`, "i"),
      new RegExp(`["']${quoted}["']\\s*:\\s*([\\w.-]+)`, "i"),
      new RegExp(`\\b${quoted}\\s*=\\s*([\\w.-]+)`, "i"),
    ];

    for (const pattern of patterns) {
      const match = raw.match(pattern);
      if (match?.[1]) {
        result[field] = match[1].trim();
        break;
      }
    }
  });

  return result;
}

interface UseJsonScannerProps {
  filterField?: string;
}

export function useJsonScanner({ filterField = "id" }: UseJsonScannerProps = {}) {
  const [filteredIds, setFilteredIds] = useState<Set<number>>(new Set());

  const handleScanned = useCallback((values: Record<string, string>) => {
    const val = values[filterField];
    const id = val ? Number(val) : NaN;
    if (!isNaN(id) && id > 0) {
      setFilteredIds((prev) => new Set([...prev, id]));
    }
  }, [filterField]);

  const clearFilter = useCallback(() => {
    setFilteredIds(new Set());
  }, []);

  const isFiltering = filteredIds.size > 0;

  const filterItems = useCallback(<T,>(items: T[], key: keyof T): T[] => {
    if (!isFiltering) return items;
    return items.filter((item) => {
      const itemVal = item[key];
      return typeof itemVal === "number" && filteredIds.has(itemVal);
    });
  }, [isFiltering, filteredIds]);

  return {
    filteredIds,
    handleScanned,
    clearFilter,
    isFiltering,
    filterItems,
  };
}
