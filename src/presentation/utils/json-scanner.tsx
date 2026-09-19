import { useState } from "react";
import { ActionIcon, Text, TextInput, Tooltip } from "@mantine/core";
import { QrCodeIcon, XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { parseQrFields } from "../../hooks/useJsonScanner";

// ─────────────────────────────────────────────────────────────────────────────

interface JsonScannerProps {
  /** Campos que se quieren extraer del JSON (ej: ["id", "correlativo"]) */
  fields: string[];
  /** Callback con Record<field, value> cada vez que se parsea algo */
  onScanned: (values: Record<string, string>) => void;
  /** true cuando el filtro está activo (hay ids escaneados) */
  isFiltering: boolean;
  /** Limpiar el filtro */
  onClearFilter: () => void;
  /** Número de lotes visibles tras el filtro */
  filteredCount?: number;
}

/**
 * Input de escaneo JSON genérico.
 * Recibe texto crudo (pegar o leer con lector USB/bluetooth), lo parsea
 * tolerando corrupción y devuelve los campos solicitados al padre.
 */
export const JsonScanner = ({
  fields,
  onScanned,
  isFiltering,
  onClearFilter,
  filteredCount,
}: JsonScannerProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (raw: string) => {
    setInputValue(raw);
    if (!raw.trim()) return;

    const values = parseQrFields(raw, fields);
    const hasAny = Object.values(values).some((v) => v !== "");
    if (hasAny) {
      onScanned(values);
      // Limpiar el input tras una lectura exitosa (comportamiento de scanner USB)
      setTimeout(() => setInputValue(""), 300);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Badge de filtro activo */}
      {isFiltering && (
        <div
          className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/30 
          rounded-xl px-3 py-1.5 animate-in fade-in slide-in-from-left-2 duration-200"
        >
          <FunnelIcon className="w-3 h-3 text-indigo-400" />
          <Text size="10px" fw={700} c="indigo.3" className="uppercase">
            {filteredCount !== undefined
              ? `${filteredCount} item${filteredCount !== 1 ? "s" : ""}`
              : "Filtrado"}
          </Text>
          <Tooltip label="Quitar filtro y ver todos" position="top" withArrow>
            <ActionIcon
              size="xs"
              variant="subtle"
              color="red"
              onClick={onClearFilter}
              className="ml-0.5"
            >
              <XMarkIcon className="w-3 h-3" />
            </ActionIcon>
          </Tooltip>
        </div>
      )}

      {/* Input de escaneo */}
      <TextInput
        leftSection={<QrCodeIcon className="w-3.5 h-3.5 text-zinc-500" />}
        radius="xl"
        size="xs"
        placeholder="Escanear..."
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        styles={{
          input: {
            width: 180, // Ancho estable para evitar saltos en el layout
            backgroundColor: "var(--mantine-color-dark-6)",
            fontFamily: "var(--mantine-font-family-mono)",
            border: isFiltering
              ? "1px solid var(--mantine-color-indigo-8)"
              : "1px solid var(--mantine-color-dark-4)",
          },
        }}
      />
    </div>
  );
};
