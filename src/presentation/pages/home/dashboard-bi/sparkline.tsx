import dayjs from "dayjs";
import "dayjs/locale/es";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  YAxis,
  Tooltip,
} from "recharts";
import { formatNumber } from "../../../../shared/functions/formatNumber";

dayjs.locale("es");

/**
 * Convierte '2026-05' o similar a 'Mayo 2026'
 */
const fmtMesNombre = (str?: string): string => {
  if (!str) return "—";
  const d = dayjs(str, "YYYY-MM");
  if (!d.isValid()) return str;
  const mesNombre = d.format("MMMM YYYY");
  return mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1);
};

interface SparklineProps {
  data: { x: string; Valor: number }[];
  /** Color del area + linea. Hex por defecto. */
  color?: string;
  height?: number;
  /** Tipo de indicador para personalizar el tooltip (ej. "flujoNeto", "pedidos", "entregas") */
  tooltipTipo?: "flujoNeto" | "pedidos" | "entregas";
}

const CustomSparklineTooltip = ({
  active,
  payload,
  label,
  tooltipTipo,
}: {
  active?: boolean;
  payload?: Array<{ value: number; color: string }>;
  label?: string;
  tooltipTipo?: "flujoNeto" | "pedidos" | "entregas";
}) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const color = payload[0].color;
  const mesFormateado = fmtMesNombre(label);

  let textoDetalle = "";
  if (tooltipTipo === "flujoNeto") {
    if (val < 0) {
      textoDetalle = `Reducción de ${Math.abs(val)} unidades (salieron más de las que entraron)`;
    } else if (val > 0) {
      textoDetalle = `Incremento de ${val} unidades (entraron más de las que salieron)`;
    } else {
      textoDetalle = "Equilibrio (mismas entradas que salidas)";
    }
  } else if (tooltipTipo === "pedidos") {
    textoDetalle = `${formatNumber(val, 0)} pedidos creados`;
  } else if (tooltipTipo === "entregas") {
    textoDetalle = `${formatNumber(val, 0)} pedidos completados`;
  }

  return (
    <div className="bg-zinc-900/95 border border-zinc-700/80 rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md max-w-xs">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="text-[11px] font-bold text-zinc-200 tracking-wider">
          {mesFormateado}
        </span>
      </div>
      <div className="text-sm font-extrabold text-white pl-3.5">
        {formatNumber(val, 0)} {tooltipTipo === "flujoNeto" ? "unidades" : ""}
      </div>
      {textoDetalle && (
        <div className="text-[11px] text-zinc-400 mt-1 leading-tight border-t border-zinc-800 pt-1.5 pl-3.5">
          {textoDetalle}
        </div>
      )}
    </div>
  );
};

/**
 * Mini grafico de tendencia sin ejes, ideal para KPI cards.
 * Usa Recharts directo (AreaChart simplificado).
 */
export const Sparkline = ({
  data,
  color = "#10b981",
  height = 50,
  tooltipTipo,
}: SparklineProps) => {
  if (data.length === 0) {
    return (
      <div
        style={{ height, width: "100%" }}
        className="flex items-center justify-center text-zinc-600 text-xs italic"
      >
        Sin datos
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 4, right: 2, left: 2, bottom: 0 }}
      >
        <defs>
          <linearGradient
            id={`sparkline-grad-${color.replace("#", "")}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Tooltip
          content={<CustomSparklineTooltip tooltipTipo={tooltipTipo} />}
          cursor={{ stroke: `${color}88`, strokeWidth: 1, strokeDasharray: "2 2" }}
        />
        <Area
          type="monotone"
          dataKey="Valor"
          stroke={color}
          strokeWidth={2}
          fill={`url(#sparkline-grad-${color.replace("#", "")})`}
          isAnimationActive={false}
          dot={{ r: 3, fill: color, stroke: "#18181b", strokeWidth: 1 }}
          activeDot={{ r: 5, fill: color, stroke: "#ffffff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};