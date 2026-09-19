import { Badge, NumberInput, Text } from "@mantine/core";
import dayjs from "dayjs";
import { formatNumber } from "../../../../../../../shared/functions/formatNumber";
import type { DetalleRequerimientoExtendido } from "../../../../../service/atencion.responses";
import type { RES_LoteDisponible } from "../../../../../../../service/responses/lote-producto";

interface LoteRowProps {
  lote: RES_LoteDisponible;
  idDetalleReq: number;
  cant: number;
  maxBase: number;
  maxLote: number;
  detalle_req: DetalleRequerimientoExtendido;
  stockVisible: number;
  handleCantChange: (idDetalle: number, idLote: number, cant: number) => void;
  handleCantLoteChange: (
    idDetalle: number,
    idLote: number,
    cant: number,
  ) => void;
}

export const LoteRow = ({
  lote,
  idDetalleReq,
  cant,
  maxBase,
  maxLote,
  detalle_req,
  stockVisible,
  handleCantChange,
  handleCantLoteChange,
}: LoteRowProps) => {
  const esCritico =
    lote.dias_para_vencer !== null && lote.dias_para_vencer <= 5;
  const esVencido = lote.dias_para_vencer !== null && lote.dias_para_vencer < 0;

  return (
    <tr
      className={`hover:bg-zinc-800/30 transition-colors ${
        cant > 0 ? "bg-indigo-950/20" : ""
      }`}
    >
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold text-zinc-200">
            {lote.correlativo}
          </span>
          {lote.fecha_hora_ingreso && (
            <span className="text-[10px] text-zinc-500">
              Ingreso: {dayjs(lote.fecha_hora_ingreso).format("DD/MM/YYYY")}
            </span>
          )}
        </div>
      </td>

      <td className="text-center px-4">
        {lote.fecha_vencimiento ? (
          <div className="flex flex-col items-center">
            <span
              className={`text-xs font-medium ${
                esVencido
                  ? "text-red-400 font-bold"
                  : esCritico
                    ? "text-amber-400 font-semibold"
                    : "text-zinc-400"
              }`}
            >
              {dayjs(lote.fecha_vencimiento).format("DD/MM/YYYY")}
            </span>
            {lote.dias_para_vencer !== null && (
              <span
                className={`text-[9px] font-bold ${
                  esVencido
                    ? "text-red-500"
                    : esCritico
                      ? "text-amber-500"
                      : "text-zinc-500"
                }`}
              >
                {esVencido
                  ? `Venció hace ${Math.abs(lote.dias_para_vencer)}d`
                  : `${lote.dias_para_vencer}d restantes`}
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-zinc-600 italic">No perecible</span>
        )}
      </td>

      <td className="text-center px-4">
        <div className="flex flex-col items-center gap-0.5">
          <Badge
            variant="dot"
            color={
              stockVisible <= 0 ? "red" : stockVisible < 10 ? "yellow" : "teal"
            }
            size="sm"
            className="font-mono"
          >
            {formatNumber(stockVisible)} {detalle_req.unidad_medida_base_abv}
          </Badge>
          {lote.stock_actual !== undefined &&
            lote.unidad_medida_lote_abv && (
              <span className="text-[10px] text-zinc-500">
                ({formatNumber(lote.stock_actual)}{" "}
                {lote.unidad_medida_lote_abv})
              </span>
            )}
        </div>
      </td>

      <td className="text-center px-4">
        <div className="flex items-center justify-center gap-2">
          {detalle_req.id_unidad_medida_base !==
            detalle_req.id_unidad_medida_req && (
            <NumberInput
              size="xs"
              radius="xl"
              min={0}
              max={maxLote}
              value={cant > 0 ? (cant / detalle_req.equivReq).toFixed(2) : ""}
              onChange={(val) =>
                handleCantLoteChange(idDetalleReq, lote.id_lote, Number(val))
              }
              placeholder="0"
              clampBehavior="strict"
              hideControls
              rightSection={
                <Text
                  size="11px"
                  fw={600}
                  c="violet"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {detalle_req.unidad_medida_req_abv}
                </Text>
              }
              rightSectionWidth={48}
              classNames={{
                input: `w-24`,
              }}
            />
          )}

          <NumberInput
            size="xs"
            radius="xl"
            min={0}
            max={maxBase}
            value={cant || ""}
            onChange={(val) =>
              handleCantChange(idDetalleReq, lote.id_lote, Number(val))
            }
            placeholder="0"
            clampBehavior="strict"
            hideControls
            rightSection={
              <Text
                size="11px"
                fw={600}
                c="blue"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {detalle_req.unidad_medida_base_abv}
              </Text>
            }
            rightSectionWidth={48}
            classNames={{
              input: `w-24`,
            }}
          />
        </div>
      </td>
    </tr>
  );
};
