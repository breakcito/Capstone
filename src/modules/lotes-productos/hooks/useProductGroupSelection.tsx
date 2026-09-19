import { useState, useMemo } from "react";
import { ActionIcon, Checkbox, Group, Tooltip } from "@mantine/core";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { type DataTableColumn } from "mantine-datatable";
import type { RES_Lote } from "../service/lotes.responses";

interface UseProductGroupSelectionProps {
  lotes: RES_Lote[];
  columns: DataTableColumn<RES_Lote>[];
  onPrint: (lotes: RES_Lote | RES_Lote[]) => void;
  selection?: {
    selectedRecords: RES_Lote[];
    setSelectedRecords: (
      val: RES_Lote[] | ((prev: RES_Lote[]) => RES_Lote[]),
    ) => void;
  };
}

export const useProductGroupSelection = ({
  lotes,
  columns,
  onPrint,
  selection,
}: UseProductGroupSelectionProps) => {
  const [internalSelected, setInternalSelected] = useState<RES_Lote[]>([]);

  const selectedRecords = selection
    ? selection.selectedRecords
    : internalSelected;
  const setSelectedRecords = selection
    ? selection.setSelectedRecords
    : setInternalSelected;

  const lotesIds = useMemo(() => lotes.map((l) => l.id_lote), [lotes]);
  const groupSelectedCount = useMemo(
    () => selectedRecords.filter((r) => lotesIds.includes(r.id_lote)).length,
    [selectedRecords, lotesIds],
  );

  const allSelected = groupSelectedCount === lotes.length && lotes.length > 0;
  const isIndeterminate = groupSelectedCount > 0 && groupSelectedCount < lotes.length;

  const enhancedColumns = useMemo(() => {
    return columns.map((col) => {
      if (col.accessor === "ticket") {
        return {
          ...col,
          width: 90, // Ajustado para el checkbox y botón
          title: (
            <Group gap={16} wrap="nowrap">
              <Checkbox
                size="xs"
                color="indigo"
                checked={allSelected}
                indeterminate={isIndeterminate}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    // Agregar solo los que no están
                    setSelectedRecords((prev) => {
                      const others = prev.filter(
                        (p) => !lotes.some((l) => l.id_lote === p.id_lote),
                      );
                      return [...others, ...lotes];
                    });
                  } else {
                    // Quitar solo los de este grupo
                    setSelectedRecords((prev) =>
                      prev.filter(
                        (p) => !lotes.some((l) => l.id_lote === p.id_lote),
                      ),
                    );
                  }
                }}
              />
              {groupSelectedCount > 0 && (
                <Tooltip
                  label={`Imprimir ${groupSelectedCount} de este grupo`}
                  position="top"
                  withArrow
                >
                  <ActionIcon
                    variant="filled"
                    color="indigo"
                    size="sm"
                    onClick={() => onPrint(selectedRecords.filter(r => lotes.some(l => l.id_lote === r.id_lote)))}
                    className="shadow-md animate-in zoom-in-50 duration-200"
                  >
                    <PrinterIcon className="w-3.5 h-3.5" />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
          ),
          render: (record: RES_Lote) => (
            <Group gap={8} wrap="nowrap" className="pl-0.5">
              <Checkbox
                size="xs"
                color="indigo"
                className="cursor-pointer"
                checked={selectedRecords.some(
                  (r) => r.id_lote === record.id_lote,
                )}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    setSelectedRecords((prev) => [...prev, record]);
                  } else {
                    setSelectedRecords((prev) =>
                      prev.filter((r) => r.id_lote !== record.id_lote),
                    );
                  }
                }}
              />
              {col.render && col.render(record, 0)}
            </Group>
          ),
        };
      }
      return col;
    });
  }, [
    columns,
    selectedRecords,
    allSelected,
    isIndeterminate,
    lotes,
    groupSelectedCount,
    onPrint,
    setSelectedRecords,
  ]);

  return { enhancedColumns, selectedRecords, setSelectedRecords };
};
