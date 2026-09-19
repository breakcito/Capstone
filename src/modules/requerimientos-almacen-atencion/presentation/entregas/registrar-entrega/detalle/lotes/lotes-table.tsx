import { Table } from "@mantine/core";
import { LoteRow } from "./lote-row";
import type { DetalleRequerimientoExtendido } from "../../../../../service/atencion.responses";
import type { RES_LoteDisponible } from "../../../../../../../service/responses/lote-producto";
import { JsonScanner } from "../../../../../../../presentation/utils/json-scanner";
import { useJsonScanner } from "../../../../../../../hooks/useJsonScanner";

interface LotesTableProps {
  lotes: RES_LoteDisponible[];
  idDetalleReq: number;
  pendienteBase: number;
  tEntregadoDetalleActualBase: number;
  entregaCantidades: Record<number, Record<number, number>>;
  detalle_req: DetalleRequerimientoExtendido;
  handleCantChange: (idDetalle: number, idLote: number, cant: number) => void;
  handleCantLoteChange: (
    idDetalle: number,
    idLote: number,
    cant: number,
  ) => void;
}

export const LotesTable = ({
  lotes,
  idDetalleReq,
  pendienteBase,
  tEntregadoDetalleActualBase,
  entregaCantidades,
  detalle_req,
  handleCantChange,
  handleCantLoteChange,
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
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/40">
          {lotesVisibles.length === 0 ? (
            <tr>
              <td
                colSpan={4}
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

              // Stock restante global (lo que se muestra al usuario)
              const stockVisible = Math.max(0, lote.stock_actual_base || 0);

              // Lo máximo extra que puede añadir esta fila actual
              const maxBase = Math.min(
                stockVisible + cant,
                pendienteBase - (tEntregadoDetalleActualBase - cant),
              );

              const maxLote =
                detalle_req.equivReq > 0 ? maxBase / detalle_req.equivReq : 0;

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
                  handleCantChange={handleCantChange}
                  handleCantLoteChange={handleCantLoteChange}
                />
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};
