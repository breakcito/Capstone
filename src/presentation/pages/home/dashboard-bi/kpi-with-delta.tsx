import { Card, Group, Stack, Text, Badge } from "@mantine/core";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";

interface KpiWithDeltaProps {
  title: string;
  value: string;
  /** Delta vs período anterior (ej. "+12%" o "-3%"). Si es null no se muestra. */
  deltaPct?: number | null;
  /** Si true, un delta POSITIVO es bueno (ej. Exactitud). Default false. */
  mayorEsMejor?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  descripcion?: string;
}

/**
 * KPI card premium con delta vs período anterior.
 * - Verde si mejoró (siguiendo la lógica de mayorEsMejor)
 * - Rojo si empeoró
 * - Gris si está estable (delta < 1%)
 */
export const KpiWithDelta = ({
  title,
  value,
  deltaPct,
  mayorEsMejor = false,
  icon: Icon,
  color,
  descripcion,
}: KpiWithDeltaProps) => {
  const hasDelta = typeof deltaPct === "number" && !isNaN(deltaPct);

  let deltaColor = "zinc.5";
  let DeltaIcon: React.ComponentType<{ className?: string }> = MinusIcon;
  let deltaText = "—";
  if (hasDelta && deltaPct !== null && deltaPct !== undefined) {
    const safeDelta = Number(deltaPct);
    if (Number.isFinite(safeDelta)) {
      deltaText = `${safeDelta >= 0 ? "+" : ""}${safeDelta.toFixed(1)}%`;
      const improving = mayorEsMejor ? safeDelta > 0 : safeDelta < 0;
      const worsening = mayorEsMejor ? safeDelta < 0 : safeDelta > 0;

      if (Math.abs(safeDelta) < 0.5) {
        deltaColor = "zinc.5";
        DeltaIcon = MinusIcon;
      } else if (improving) {
        deltaColor = "green.4";
        DeltaIcon = ArrowTrendingUpIcon;
      } else if (worsening) {
        deltaColor = "red.4";
        DeltaIcon = ArrowTrendingDownIcon;
      }
    }
  }

  return (
    <Card
      padding="lg"
      radius="xl"
      className="bg-zinc-900/40 border border-zinc-800/80 relative overflow-hidden"
    >
      <div
        className={`absolute inset-0 bg-linear-to-br from-${color}-500/10 to-${color}-700/5 opacity-50`}
      />
      <div className="relative z-10 space-y-3">
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
          <div className={`p-2 rounded-xl bg-${color}-500/15 text-${color}-400`}>
            <Icon className="w-5 h-5" />
          </div>
        </Group>

        <Title_ value={value} />

        {hasDelta && (
          <Group gap={4} className="pt-1">
            <Badge
              variant="light"
              color={deltaColor.split(".")[0] as "green" | "red" | "zinc"}
              radius="sm"
              size="sm"
              leftSection={<DeltaIcon className="w-3 h-3" />}
              className="font-bold"
            >
              {deltaText}
            </Badge>
            <Text size="10px" c="zinc.5">
              respecto al período anterior
            </Text>
          </Group>
        )}
      </div>
    </Card>
  );
};

// Sub-componente local: titulo grande del KPI
const Title_ = ({ value }: { value: string }) => (
  <div className="flex items-baseline gap-2">
    <span className="text-3xl font-extrabold text-white tracking-tight">
      {value}
    </span>
  </div>
);