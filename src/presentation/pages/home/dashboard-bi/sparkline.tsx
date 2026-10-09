import {
  ResponsiveContainer,
  AreaChart,
  Area,
  YAxis,
} from "recharts";

interface SparklineProps {
  data: { x: string; y: number }[];
  /** Color del area + linea. Hex por defecto. */
  color?: string;
  height?: number;
}

/**
 * Mini grafico de tendencia sin ejes, ideal para KPI cards.
 * Usa Recharts directo (AreaChart simplificado).
 */
export const Sparkline = ({
  data,
  color = "#10b981",
  height = 50,
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
        margin={{ top: 2, right: 0, left: 0, bottom: 0 }}
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
        <Area
          type="monotone"
          dataKey="y"
          stroke={color}
          strokeWidth={2}
          fill={`url(#sparkline-grad-${color.replace("#", "")})`}
          isAnimationActive={false}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};