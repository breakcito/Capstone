import { Badge, Group, Text } from "@mantine/core";
import { formatNumber } from "../../../../../../shared/functions/formatNumber";
import type { DetalleRequerimientoExtendido } from "../../../../service/atencion.responses";
import { LotesTable } from "./lotes/lotes-table";
import { ActivosTable } from "./activos/activos-table";
import type { RES_LoteDisponible } from "../../../../../../service/responses/lote-producto";
import type { RES_ActivoFijoDisponible } from "../../../../../../service/responses/activo-fijo";
import type { RES_LoteMineral } from "../../../../../../service/responses/lote-mineral";
import type { DestinoItem } from "../../../../hooks/useRegistrarEntrega";
import { TipoBien } from "../../../../../../shared/enums/_generic/tipo-bien";

interface GroupByDetalleRequerimientoProps {
  detalle_req: DetalleRequerimientoExtendido;
  lotes: RES_LoteDisponible[];
  activosFijos: RES_ActivoFijoDisponible[];
  index: number;
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

export const GroupByDetalleRequerimiento = ({
  detalle_req,
  lotes,
  activosFijos,
  index,
  entregaCantidades,
  entregaCantidadesActivos,
  allActivos,
  lotesMineral,
  destinosMap,
  handleCantChange,
  handleCantLoteChange,
  handleCantActivoChange,
  handleDestinoChange,
}: GroupByDetalleRequerimientoProps) => {
  const idDetalleReq = detalle_req.id_requerimiento_almacen_detalle;
  const pendienteBase = detalle_req.pendiente_base;
  const isActivoFijo = detalle_req.tipo_bien === TipoBien.ActivoFijo;

  const tEntregadoDetalleActualBase = isActivoFijo
    ? activosFijos.reduce(
        (acc, a) =>
          acc + (entregaCantidadesActivos[idDetalleReq]?.[a.id_activo] || 0),
        0,
      )
    : lotes.reduce(
        (acc, l) => acc + (entregaCantidades[idDetalleReq]?.[l.id_lote] || 0),
        0,
      );

  const isFirst = index === 0;

  return (
    <div
      className={`p-5 space-y-5 transition-colors hover:bg-zinc-800/10 ${!isFirst ? "border-t border-zinc-800/40" : ""}`}
    >
      {/* Detail Info Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <Group gap="xs" className="pl-1 flex flex-row">
          <div className="flex flex-row items-center gap-2.5">
            <Text size="sm" fw={800} className="text-zinc-200">
              <span className="text-white font-black">
                {formatNumber(detalle_req.cantidad_solicitada)}{" "}
                {detalle_req.unidad_medida_req_abv}
              </span>
            </Text>
          </div>
          {detalle_req.id_unidad_medida_base !==
            detalle_req.id_unidad_medida_req && (
            <Badge size="sm" variant="transparent" c="blue">
              {formatNumber(detalle_req.cantidad_solicitada_base)}{" "}
              {detalle_req.unidad_medida_base_abv}
            </Badge>
          )}
        </Group>

        <div className="flex items-center gap-2.5 w-full lg:w-auto self-end">
          {/* Por Entregar */}
          <div className="flex-1 lg:flex-none flex items-center gap-3 bg-linear-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-2 px-4 shadow-sm min-w-27.5">
            <div className="flex flex-row gap-1.5">
              <Text
                size="10px"
                c="pink"
                fw={700}
                className="uppercase self-center"
              >
                Pendiente
              </Text>
              <div className="flex items-baseline gap-1">
                <Text size="xs" fw={900} c={"pink"}>
                  {formatNumber(pendienteBase)}
                </Text>
                <Text
                  size="10px"
                  fw={700}
                  c="pink.1"
                  className="uppercase opacity-60"
                >
                  {detalle_req.unidad_medida_base_abv}
                </Text>
              </div>
            </div>
          </div>

          {/* Despachando */}
          <div
            className={`flex-1 lg:flex-none flex items-center gap-3 border border-sky-500/20 rounded-xl p-2 px-4 shadow-sm min-w-32.5 transition-all duration-300 ${
              tEntregadoDetalleActualBase > 0
                ? "bg-linear-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/30 shadow-emerald-500/5"
                : "bg-linear-to-br from-indigo-500/5 to-zinc-800/10 border-zinc-800/80 shadow-inner"
            }`}
          >
            <div className="flex flex-row gap-1.5">
              <Text
                size="10px"
                c={tEntregadoDetalleActualBase > 0 ? "teal.3" : "indigo.4"}
                fw={700}
                className="uppercase self-center"
              >
                Despachando
              </Text>
              <div className="flex items-baseline gap-1">
                <Text
                  size="sm"
                  fw={900}
                  className={`font-mono tracking-tighter ${
                    tEntregadoDetalleActualBase > 0
                      ? "text-emerald-400"
                      : "text-indigo-400/70"
                  }`}
                >
                  {formatNumber(tEntregadoDetalleActualBase)}
                </Text>
                <Text
                  size="10px"
                  fw={800}
                  c="zinc.5"
                  className="uppercase opacity-60"
                >
                  {detalle_req.unidad_medida_base_abv}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isActivoFijo ? (
        <ActivosTable
          activosFijos={activosFijos}
          idDetalleReq={idDetalleReq}
          pendienteBase={pendienteBase}
          tEntregadoDetalleActualBase={tEntregadoDetalleActualBase}
          entregaCantidadesActivos={entregaCantidadesActivos}
          detalle_req={detalle_req}
          allActivos={allActivos}
          lotesMineral={lotesMineral}
          destinosMap={destinosMap}
          handleCantActivoChange={handleCantActivoChange}
          handleDestinoChange={handleDestinoChange}
        />
      ) : (
        <LotesTable
          lotes={lotes}
          idDetalleReq={idDetalleReq}
          pendienteBase={pendienteBase}
          tEntregadoDetalleActualBase={tEntregadoDetalleActualBase}
          entregaCantidades={entregaCantidades}
          detalle_req={detalle_req}
          allActivos={allActivos}
          lotesMineral={lotesMineral}
          destinosMap={destinosMap}
          handleCantChange={handleCantChange}
          handleCantLoteChange={handleCantLoteChange}
          handleDestinoChange={handleDestinoChange}
        />
      )}
    </div>
  );
};
