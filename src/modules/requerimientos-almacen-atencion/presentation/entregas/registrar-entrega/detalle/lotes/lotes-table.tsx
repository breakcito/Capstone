import { Table } from "@mantine/core";
import { LoteRow } from "./lote-row";
import type { DetalleRequerimientoExtendido } from "../../../../../service/atencion.responses";
import type { RES_LoteDisponible } from "../../../../../../../service/responses/lote-producto";
import type { RES_ActivoFijoDisponible } from "../../../../../../../service/responses/activo-fijo";
import type { RES_LoteMineral } from "../../../../../../../service/responses/lote-mineral";
import type { DestinoItem } from "../../../../../hooks/useRegistrarEntrega";
import { JsonScanner } from "../../../../../../../presentation/utils/json-scanner";
import { useJsonScanner } from "../../../../../../../hooks/useJsonScanner";

interface LotesTableProps {
  lotes: RES_LoteDisponible[];
  idDetalleReq: number;
  pendienteBase: number;
  tEntregadoDetalleActualBase: number;
  entregaCantidades: Record<number, Record<number, number>>;
  detalle_req: DetalleRequerimientoExtendido;
  allActivos: RES_ActivoFijoDisponible[];
  lotesMineral: RES_LoteMineral[];
  destinosMap: Record<string, DestinoItem>;
  handleCantChange: (idDetalle: number, idLote: number, cant: number) => void;
  handleCantLoteChange: (
    idDetalle: number,
    idLote: number,
    cant: number,
  ) => void;
  handleDestinoChange: (
    key: string,
    field: string,
    value: string | number | null,
  ) => void;
}

export const LotesTable = ({
  lotes,
  idDetalleReq,
  pendienteBase,
  tEntregadoDetalleActualBase,
  entregaCantidades,
  detalle_req,
  allActivos,
  lotesMineral,
  destinosMap,
  handleCantChange,
  handleCantLoteChange,
  handleDestinoChange,
}: LotesTableProps) => {
  const { isFiltering, clearFilter, handleScanned, filterItems } =
    useJsonScanner();
  const lotesVisibles = filterItems(lotes, "id_lote");

  return (
    <div className="overflow-hidden border border-zinc-800/60 rounded-2xl bg-zinc-950/30 shadow-inner">
      {/* Barra de escaneo QR */}
      <div className="flex justify-end px-4 py-2 border-b border-zinc-800/40 bg-zinc-900/30">
        <JsonScanner
          fields={["id"]}
          onScanned={handleScanned}
          isFiltering={isFiltering}
          onClearFilter={clearFilter}
          filteredCount={lotesVisibles.length}
        />
      </div>

      <Table
        verticalSpacing="sm"
        horizontalSpacing="lg"
        className="border-collapse"
      >
        <thead className="bg-zinc-900/50 text-zinc-500 text-[10px] font-black uppercase tracking-widest border-b border-zinc-800/60">
          <tr>
            <th className="py-4 text-center">Lote</th>
            <th className="text-center">Vencimiento</th>
            <th className="text-center">Stock Disponible</th>
            <th className="text-center">Cant. a Despachar</th>
            <th className="text-center">Destino</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/40">
          {lotesVisibles.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-10 text-center text-zinc-600 italic text-sm font-medium"
              >
                {isFiltering
                  ? "Ningún lote escaneado coincide con los disponibles."
                  : "No se encontraron lotes disponibles en este almacén."}
              </td>
            </tr>
          ) : (
            lotesVisibles.map((lote) => {
              const cant = entregaCantidades[idDetalleReq]?.[lote.id_lote] || 0;

              // Stock real disponible considerando lo asignado a otros detalles en este modal
              // Suma total en todos los detalles de este modal
              // const totalItemsTotal = Object.values(entregaCantidades).reduce(
              //   (sum, lotesMap) => {
              //     return sum + (lotesMap[lote.id_lote] || 0);
              //   },
              //   0,
              // );

              // Stock restante global (lo que se muestra al usuario)
              const stockVisible = Math.max(0, lote.stock_actual_base || 0);

              // Lo máximo extra que puede añadir esta fila actual
              const maxBase = Math.min(
                stockVisible + cant,
                pendienteBase - (tEntregadoDetalleActualBase - cant),
              );
              const maxLote = maxBase / (lote.contenido_por_presentacion || 1);

              return (
                <LoteRow
                  key={lote.id_lote}
                  lote={lote}
                  idDetalleReq={idDetalleReq}
                  cant={cant}
                  maxBase={maxBase}
                  maxLote={maxLote}
                  detalle_req={detalle_req}
                  stockVisible={stockVisible}
                  allActivos={allActivos}
                  lotesMineral={lotesMineral}
                  destinosMap={destinosMap}
                  handleCantChange={handleCantChange}
                  handleCantLoteChange={handleCantLoteChange}
                  handleDestinoChange={handleDestinoChange}
                />
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};
