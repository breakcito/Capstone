import { Card, Stack, Text, Group } from "@mantine/core";
import { LightBulbIcon, ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import type {
  RES_AlertaStock,
  RES_KPIsGenerales,
  RES_TAPPorAlmacen,
} from "../../../../modules/indicadores/service/indicadores.responses";

interface InsightsBannerProps {
  kpis: RES_KPIsGenerales | null;
  alertas: RES_AlertaStock[];
  tapAlmacen: RES_TAPPorAlmacen[];
}

/**
 * Convierte cualquier valor a numero finito. Devuelve 0 si no es valido.
 */
const safeNum = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/**
 * Convierte a numero finito o devuelve null si no es valido.
 */
const safeNumOrNull = (v: unknown): number | null => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/**
 * Genera un parrafo de insights en lenguaje natural a partir de los datos
 * del dashboard. Todas las operaciones numericas son defensivas contra
 * null / undefined / strings que pueda devolver el backend.
 */
export const InsightsBanner = ({
  kpis,
  alertas,
  tapAlmacen,
}: InsightsBannerProps) => {
  const insights: { tipo: "alerta" | "info" | "positivo"; texto: string }[] = [];

  // -----------------------------------------------------------------
  // 1. Alertas criticas
  // -----------------------------------------------------------------
  const criticas = alertas.filter((a) => a.nivel_alerta === "CRITICO");
  const sinStock = alertas.filter((a) => a.nivel_alerta === "SIN STOCK");

  if (sinStock.length > 0) {
    insights.push({
      tipo: "alerta",
      texto: `${sinStock.length} producto${sinStock.length > 1 ? "s" : ""} sin stock: ${sinStock
        .slice(0, 3)
        .map((a) => a.producto)
        .join(", ")}${sinStock.length > 3 ? ` y ${sinStock.length - 3} mas` : ""}.`,
    });
  }
  if (criticas.length > 0) {
    insights.push({
      tipo: "alerta",
      texto: `${criticas.length} producto${
        criticas.length > 1 ? "s en stock critico" : " en stock critico"
      }: ${criticas
        .slice(0, 3)
        .map((a) => a.producto)
        .join(", ")}${criticas.length > 3 ? ` y ${criticas.length - 3} mas` : ""}.`,
    });
  }

  // -----------------------------------------------------------------
  // 2. Almacenes lentos (fuera de meta TDA > 12 min)
  // -----------------------------------------------------------------
  const lentos = tapAlmacen
    .filter((t) => t.cumplimiento_tda === "FUERA DE META")
    .sort((a, b) => safeNum(b.tap_minutos) - safeNum(a.tap_minutos))
    .slice(0, 3);
  if (lentos.length > 0) {
    insights.push({
      tipo: "alerta",
      texto: `Almacenes con tiempo de despacho fuera de meta: ${lentos
        .map((t) => `${t.almacen} (${safeNum(t.tap_minutos)} min)`)
        .join(", ")}.`,
    });
  }

  // -----------------------------------------------------------------
  // 3. Tasa de anulacion (si > 15%)
  // -----------------------------------------------------------------
  const tasaAnulacion = safeNumOrNull(kpis?.tasa_anulacion_pct);
  if (tasaAnulacion !== null && tasaAnulacion > 15) {
    insights.push({
      tipo: "alerta",
      texto: `Tasa de anulacion del ${tasaAnulacion.toFixed(
        1,
      )}% en los ultimos 30 dias. Conviene revisar las causas.`,
    });
  }

  // -----------------------------------------------------------------
  // 4. Positivo: tiempo de despacho promedio cumple meta
  // -----------------------------------------------------------------
  const tda = safeNumOrNull(kpis?.tda_minutos_promedio);
  if (tda !== null && tda <= 12) {
    insights.push({
      tipo: "positivo",
      texto: `Tiempo promedio de despacho (${tda.toFixed(
        1,
      )} min) cumple el objetivo de 12 minutos.`,
    });
  }

  // -----------------------------------------------------------------
  // 5. Positivo: trazabilidad alta
  // -----------------------------------------------------------------
  const ctl = safeNumOrNull(kpis?.ctl_porcentaje);
  if (ctl !== null && ctl >= 90) {
    insights.push({
      tipo: "positivo",
      texto: `Trazabilidad por lotes alcanza el ${ctl.toFixed(
        1,
      )}% (objetivo: 90%).`,
    });
  }

  // -----------------------------------------------------------------
  // 6. Informativo: volumen de pedidos
  // -----------------------------------------------------------------
  const req = safeNum(kpis?.req_ultimos_30_dias);
  if (req > 0) {
    insights.push({
      tipo: "info",
      texto: `En los ultimos 30 dias se gestionaron ${req} pedidos.`,
    });
  }

  // Si no hay insights, mensaje neutro
  if (insights.length === 0) {
    insights.push({
      tipo: "info",
      texto:
        "No hay alertas activas en este momento. Todos los indicadores se encuentran dentro de los rangos esperados.",
    });
  }

  return (
    <Card
      padding="lg"
      radius="xl"
      className="bg-zinc-900/40 border border-zinc-800/80"
    >
      <Stack gap="md">
        <Group gap="xs">
          <div className="p-2 rounded-xl bg-yellow-500/15 text-yellow-400">
            <LightBulbIcon className="w-5 h-5" />
          </div>
          <Text fw={800} className="text-zinc-100">
            Lo mas relevante del dia
          </Text>
        </Group>

        <Stack gap="xs">
          {insights.map((ins, i) => {
            const colorClass =
              ins.tipo === "alerta"
                ? "text-red-300 border-red-500/30 bg-red-500/5"
                : ins.tipo === "positivo"
                  ? "text-green-300 border-green-500/30 bg-green-500/5"
                  : "text-blue-300 border-blue-500/30 bg-blue-500/5";
            const Icon =
              ins.tipo === "alerta"
                ? ExclamationTriangleIcon
                : ins.tipo === "positivo"
                  ? LightBulbIcon
                  : InformationCircleIcon;
            return (
              <div
                key={i}
                className={`flex items-start gap-2.5 px-3 py-2 rounded-xl border ${colorClass}`}
              >
                <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                <Text size="sm" className="leading-snug">
                  {ins.texto}
                </Text>
              </div>
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
};