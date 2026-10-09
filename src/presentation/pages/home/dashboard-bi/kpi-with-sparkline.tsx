import { Card, Group, Stack, Text } from "@mantine/core";
import { Sparkline } from "./sparkline";

interface KpiWithSparklineProps {
  title: string;
  /** Valor a mostrar (ej. "12 min", "S/. 124,500"). */
  value: string;
  descripcion?: string;
  /** Serie temporal para la sparkline (x=mes label, y=valor). */
  serie: { x: string; y: number }[];
  color?: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * KPI card con mini sparkline. Ideal para "tendencias".
 */
export const KpiWithSparkline = ({
  title,
  value,
  descripcion,
  serie,
  color = "#6366f1",
  icon: Icon,
}: KpiWithSparklineProps) => {
  return (
    <Card
      padding="lg"
      radius="xl"
      className="bg-zinc-900/40 border border-zinc-800/80 relative overflow-hidden"
    >
      <div className="space-y-3">
        <Group justify="space-between" align="flex-start">
          <Stack gap={2}>
            <Text
              size="xs"
              fw={800}
              c="zinc.5"
              className="uppercase tracking-widest"
            >
              {title}
            </Text>
            {descripcion && (
              <Text size="10px" c="zinc.6" fs="italic">
                {descripcion}
              </Text>
            )}
          </Stack>
          <div
            className="p-2 rounded-xl"
            style={{ backgroundColor: `${color}22`, color }}
          >
            <Icon className="w-5 h-5" />
          </div>
        </Group>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-white tracking-tight">
            {value}
          </span>
        </div>

        <div className="pt-1">
          <Sparkline data={serie} color={color} height={48} />
        </div>
      </div>
    </Card>
  );
};