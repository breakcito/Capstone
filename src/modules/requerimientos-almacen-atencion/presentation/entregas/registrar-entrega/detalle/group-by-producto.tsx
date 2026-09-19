import { Badge, Group, Paper, Stack, Text } from "@mantine/core";
import { CubeIcon } from "@heroicons/react/24/outline";
import { formatNumber } from "../../../../../../shared/functions/formatNumber";
import type { DetalleRequerimientoExtendido } from "../../../../service/atencion.responses";
import type { RES_LoteDisponible } from "../../../../../../service/responses/lote-producto";
import { GroupByDetalleRequerimiento } from "./group-by-detalle-req";

import type { RES_ActivoFijoDisponible } from "../../../../../../service/responses/activo-fijo";
import type { RES_LoteMineral } from "../../../../../../service/responses/lote-mineral";
import type { DestinoItem } from "../../../../hooks/useRegistrarEntrega";

interface GroupByProductoProps {
  idProducto: number;
  group: {
    name: string;
    stock_minimo_base: number;
    stock_disponible: number;
    unidad_medida_base_abv: string;
    details: DetalleRequerimientoExtendido[];
  };
  lotesPorProducto: Record<number, RES_LoteDisponible[]>;
  activosFijosPorProducto: Record<number, RES_ActivoFijoDisponible[]>;
  entregaCantidades: Record<number, Record<number, number>>;
  entregaCantidadesActivos: Record<number, Record<number, number>>;
  allActivos: RES_ActivoFijoDisponible[];
  lotesMineral: RES_LoteMineral[];
  destinosMap: Record<string, DestinoItem>;
  handleCantChange: (idDetalle: number, idLote: number, cant: number) => void;
  handleCantLoteChange: (
    idDetalle: number,
    idLote: number,
    cant: number,
  ) => void;
  handleCantActivoChange: (
    idDetalle: number,
    idActivo: number,
    cant: number,
  ) => void;
  handleDestinoChange: (
    key: string,
    field: string,
    value: string | number | null,
  ) => void;
}

export const GroupByProducto = ({
  idProducto,
  group,
  lotesPorProducto,
  activosFijosPorProducto,
  entregaCantidades,
  entregaCantidadesActivos,
  allActivos,
  lotesMineral,
  destinosMap,
  handleCantChange,
  handleCantLoteChange,
  handleCantActivoChange,
  handleDestinoChange,
}: GroupByProductoProps) => {
  const lotes = lotesPorProducto[idProducto] || [];
  const activosFijos = activosFijosPorProducto[idProducto] || [];

  return (
    <Paper
      shadow="md"
      radius="lg"
      className="bg-zinc-900/30 border border-zinc-800/80 overflow-hidden relative"
    >
      {/* Product Header Section */}
      <div className="bg-zinc-900/60 border-b border-zinc-800/50 p-4 px-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-linear-to-br from-indigo-500/20 to-indigo-600/5 border border-indigo-500/20 shadow-inner">
              <CubeIcon className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <Text
                size="md"
                fw={900}
                className="text-white tracking-tight leading-tight"
              >
                {group.name}
              </Text>
            </div>
          </div>

          <Group gap="sm">
            <Badge variant="dot" color="grape.5" size="sm">
              Min: {formatNumber(group.stock_minimo_base)}{" "}
              {group.unidad_medida_base_abv}
            </Badge>
            <Badge
              variant="dot"
              color={
                group.stock_disponible <= group.stock_minimo_base
                  ? "orange"
                  : "teal"
              }
              size="sm"
            >
              Disponible: {formatNumber(group.stock_disponible)}{" "}
              {group.unidad_medida_base_abv}
            </Badge>
          </Group>
        </div>
      </div>

      <Stack gap="0">
        {group.details.map((detalle_req, index) => (
          <GroupByDetalleRequerimiento
            key={detalle_req.id_requerimiento_almacen_detalle}
            detalle_req={detalle_req}
            lotes={lotes}
            activosFijos={activosFijos}
            index={index}
            entregaCantidades={entregaCantidades}
            entregaCantidadesActivos={entregaCantidadesActivos}
            allActivos={allActivos}
            lotesMineral={lotesMineral}
            destinosMap={destinosMap}
            handleCantChange={handleCantChange}
            handleCantLoteChange={handleCantLoteChange}
            handleCantActivoChange={handleCantActivoChange}
            handleDestinoChange={handleDestinoChange}
          />
        ))}
      </Stack>
    </Paper>
  );
};
