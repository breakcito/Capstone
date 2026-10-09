import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Card,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  Button,
  Skeleton,
  ActionIcon,
  Divider,
  Select,
  Loader,
} from "@mantine/core";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  CartesianGrid,
} from "recharts";
import {
  ClockIcon,
  CubeTransparentIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ClipboardDocumentCheckIcon,
  ShoppingCartIcon,
  ArrowsRightLeftIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import ExcelJS from "exceljs";
import { saveAs } from "./utils/save-blob";
import { useNotify } from "../../../hooks/useNotify";
import { usePrint } from "../../../hooks/usePrint";
import { useIndicadores } from "../../../modules/indicadores/hooks/useIndicadores";
import { AuxService } from "../../../service/auxiliar.service";
import { formatNumber } from "../../../shared/functions/formatNumber";
import { DashboardBIPdf } from "./dashboard-bi-pdf";
import { GaugeProgress } from "./dashboard-bi/gauge-progress";
import { KpiWithDelta } from "./dashboard-bi/kpi-with-delta";
import { KpiWithSparkline } from "./dashboard-bi/kpi-with-sparkline";
import { InsightsBanner } from "./dashboard-bi/insights-banner";
import type {
  NivelAlerta,
} from "../../../modules/indicadores/service/indicadores.responses";

// -----------------------------------------------------------------------------
// Helpers de formato
// -----------------------------------------------------------------------------
const fmtNum = (v: number | null | undefined, decimals = 0): string => {
  if (v === null || v === undefined) return "—";
  return formatNumber(v, decimals);
};

const fmtMoney = (v: number | null | undefined): string => {
  if (v === null || v === undefined) return "—";
  return `S/. ${formatNumber(v, 2)}`;
};

const fmtTiempo = (v: number | null | undefined): string => {
  if (v === null || v === undefined) return "—";
  // Unidad inteligente: minutos, horas o dias segun la magnitud
  if (v < 60) {
    // Menos de una hora: mostrar en minutos
    return `${formatNumber(v, 0)} min`;
  } else if (v < 1440) {
    // Menos de un dia: mostrar en horas (1 decimal)
    const horas = v / 60;
    return `${formatNumber(horas, 1)} h`;
  } else {
    // Mas de un dia: mostrar en dias (1 decimal)
    const dias = v / 1440;
    return `${formatNumber(dias, 1)} dias`;
  }
};

/** Delta% vs período anterior. Devuelve null si no hay dato comparable. */
const calcDelta = (
  actual: number,
  anterior: number | null | undefined,
): number | null => {
  if (anterior === null || anterior === undefined || anterior === 0) {
    return null;
  }
  return ((actual - anterior) / anterior) * 100;
};

const COLOR_NIVEL: Record<NivelAlerta, string> = {
  "SIN STOCK": "red",
  CRITICO: "red",
  BAJO: "orange",
};

interface OpcionAlmacen {
  id_almacen: number;
  nombre: string;
}

// Tooltip customizado de Recharts (mismo estilo dark premium)
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900/95 border border-zinc-700 rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md">
      <Text size="10px" c="zinc.5" fw={700} className="uppercase mb-1">
        {label}
      </Text>
      {payload.map((p, i) => (
        <Text key={i} size="xs" c="zinc.200">
          <span style={{ color: p.color }}>●</span> {p.name}: {formatNumber(p.value, 1)}
        </Text>
      ))}
    </div>
  );
};

// =============================================================================
// Componente principal
// =============================================================================
export const DashboardBI = () => {
  // Estado del filtro de almacen (null = todos)
  const [idAlmacenFiltro, setIdAlmacenFiltro] = useState<string | null>(null);

  // Carga los almacenes disponibles para el Select del header.
  const [almacenes, setAlmacenes] = useState<OpcionAlmacen[]>([]);
  const [loadingAlmacenes, setLoadingAlmacenes] = useState(false);
  useEffect(() => {
    let mounted = true;
    setLoadingAlmacenes(true);
    AuxService.get_almacenes()
      .then((resp) => {
        if (!mounted) return;
        if (resp.success && Array.isArray(resp.data)) {
          setAlmacenes(
            resp.data.map((a) => ({
              id_almacen: a.id_almacen,
              nombre: a.nombre,
            })),
          );
        }
      })
      .finally(() => mounted && setLoadingAlmacenes(false));
    return () => {
      mounted = false;
    };
  }, []);

  const {
    loading,
    error,
    kpis,
    stockValorizado,
    topProductos,
    alertas,
    tapAlmacen,
    tendencias,
    lastUpdated,
    recargar,
  } = useIndicadores(idAlmacenFiltro ? Number(idAlmacenFiltro) : null);
  const { notifySuccess, notifyError } = useNotify();
  const { print } = usePrint();
  const [exporting, setExporting] = useState<"excel" | "pdf" | null>(null);

  // ---------------------------------------------------------------------------
  // Datos derivados
  // ---------------------------------------------------------------------------

  // Delta de pedidos: comparar los ultimos 30 dias vs los 30 dias ANTERIORES
  // (no contra "mes anterior" que es inconsistente con la ventana de 30d).
  // El backend ya calcula "req_30_dias_anteriores" para esto.
  const deltaPedidosPct = useMemo(() => {
    if (!kpis) return null;
    return calcDelta(
      kpis.req_ultimos_30_dias,
      kpis.req_30_dias_anteriores,
    );
  }, [kpis]);

  // Top 5 alertas mas criticas (SIN STOCK primero, luego CRITICO, luego BAJO).
  const topAlertas = useMemo(() => {
    const orden: Record<NivelAlerta, number> = {
      "SIN STOCK": 0,
      CRITICO: 1,
      BAJO: 2,
    };
    return [...alertas]
      .sort((a, b) => {
        const cmp = orden[a.nivel_alerta] - orden[b.nivel_alerta];
        if (cmp !== 0) return cmp;
        return a.stock_actual_base - b.stock_actual_base;
      })
      .slice(0, 5);
  }, [alertas]);

  // Series para sparklines
  const sparklinePedidos = useMemo(
    () => tendencias.map((t) => ({ x: t.mes, y: t.total_req })),
    [tendencias],
  );
  // stock_neto_mes: diferencia del mes (ingresos - salidas del mes)
  // Mas util que el acumulado para entender la operacion reciente
  const sparklineFlujoNeto = useMemo(
    () => tendencias.map((t) => ({ x: t.mes, y: t.stock_neto_mes })),
    [tendencias],
  );
  const sparklineEntregas = useMemo(
    () => tendencias.map((t) => ({ x: t.mes, y: t.entregas_mes })),
    [tendencias],
  );

  // BarChart: pedidos vs entregas vs en proceso (ultimos 6 meses)
  const pedidosChartData = useMemo(
    () =>
      tendencias.map((t) => ({
        mes: t.mes,
        Pedidos: t.total_req,
        Completados: t.entregas_mes,
        "En Despacho": t.en_despacho,
      })),
    [tendencias],
  );

  // ---------------------------------------------------------------------------
  // Handlers de exportacion
  // ---------------------------------------------------------------------------
  const handleExportExcel = async () => {
    setExporting("excel");
    try {
      const wb = new ExcelJS.Workbook();
      wb.creator = "Cupper & Hannia - Dashboard de Indicadores";
      wb.created = new Date();

      // Hoja 1: KPIs principales
      const s1 = wb.addWorksheet("Indicadores");
      s1.columns = [{ width: 40 }, { width: 22 }];
      s1.mergeCells("A1:B1");
      const t1 = s1.getCell("A1");
      t1.value = "INDICADORES PRINCIPALES";
      t1.font = { bold: true, size: 14, color: { argb: "FF0F172A" } };
      t1.alignment = { horizontal: "center", vertical: "middle" };
      const filas: Array<[string, string | number]> = [
        ["Generado", dayjs().format("DD/MM/YYYY HH:mm")],
        [
          "Tiempo promedio de despacho (min)",
          kpis?.tda_minutos_promedio?.toString() ?? "Sin datos",
        ],
        [
          "Exactitud del registro (%)",
          kpis?.edi_porcentaje?.toString() ?? "Sin datos",
        ],
        [
          "Trazabilidad por lotes (%)",
          kpis?.ctl_porcentaje?.toString() ?? "0",
        ],
        [
          "Valor del inventario (S/.)",
          kpis?.stock_valorizado_total?.toString() ?? "0",
        ],
        [
          "Productos en alerta",
          kpis?.alertas_stock_critico?.toString() ?? "0",
        ],
        [
          "Tasa de anulacion 30d (%)",
          kpis?.tasa_anulacion_pct?.toString() ?? "0",
        ],
        [
          "Pedidos en gestion (30d)",
          kpis?.req_ultimos_30_dias?.toString() ?? "0",
        ],
      ];
      filas.forEach((row, i) => {
        const r = s1.getRow(i + 3);
        r.getCell(1).value = row[0];
        r.getCell(2).value = row[1];
        r.getCell(1).font = { bold: true };
      });

      // Hoja 2: Valor del inventario por almacen
      const s2 = wb.addWorksheet("Inventario por Almacen");
      s2.columns = [
        { header: "Almacen", width: 32 },
        { header: "Productos activos", width: 18 },
        { header: "Unidades base", width: 18 },
        { header: "Valorizado (S/.)", width: 18 },
      ];
      for (const s of stockValorizado) {
        s2.addRow([s.almacen, s.productos_activos, s.unidades_base_total, s.valorizado]);
      }

      // Hoja 3: Tendencias (ultimos 6 meses)
      const s3 = wb.addWorksheet("Tendencias 6m");
      s3.columns = [
        { header: "Mes", width: 12 },
        { header: "Pedidos", width: 14 },
        { header: "Entregados", width: 14 },
        { header: "Ingresos (base)", width: 16 },
        { header: "Salidas (base)", width: 16 },
      ];
      for (const t of tendencias) {
        s3.addRow([t.mes, t.total_req, t.entregas_mes, t.ingresos_base, t.salidas_base]);
      }

      // Hoja 4: Top alertas
      const s4 = wb.addWorksheet("Alertas de Stock");
      s4.columns = [
        { header: "Producto", width: 32 },
        { header: "Stock actual", width: 14 },
        { header: "Stock minimo", width: 14 },
        { header: "Nivel", width: 14 },
      ];
      for (const a of alertas) {
        s4.addRow([
          a.producto,
          a.stock_actual_base,
          a.stock_minimo_base,
          a.nivel_alerta,
        ]);
      }

      // Hoja 5: Tiempo de despacho por almacen
      const s5 = wb.addWorksheet("TDA por Almacen");
      s5.columns = [
        { header: "Almacen", width: 32 },
        { header: "Requerimentos", width: 16 },
        { header: "TAP (min)", width: 12 },
        { header: "Cumplimiento", width: 18 },
      ];
      for (const t of tapAlmacen) {
        s5.addRow([t.almacen, t.req_atendidos, t.tap_minutos, t.cumplimiento_tda]);
      }

      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(
        blob,
        `Dashboard_Indicadores_${dayjs().format("YYYYMMDD_HHmm")}.xlsx`,
      );
      notifySuccess("Excel exportado correctamente");
    } catch (err) {
      console.error(err);
      notifyError("Error al exportar el Excel");
    } finally {
      setExporting(null);
    }
  };

  const handleExportPdf = () => {
    setExporting("pdf");
    try {
      print(
        <DashboardBIPdf
          kpis={kpis}
          stockValorizado={stockValorizado}
          topProductos={topProductos}
          alertas={alertas}
          tapAlmacen={tapAlmacen}
        />,
        {
          documentTitle: `Dashboard_Indicadores_${dayjs().format("YYYYMMDD_HHmm")}`,
        },
      );
      notifySuccess("Generando PDF...");
    } catch (err) {
      console.error(err);
      notifyError("Error al generar el PDF");
    } finally {
      setExporting(null);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  if (loading && !kpis) {
    return (
      <Stack gap="md">
        <Skeleton height={28} width={320} radius="md" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={130} radius="xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} height={300} radius="xl" />
          ))}
        </div>
      </Stack>
    );
  }

  return (
    <Stack gap="xl" className="animate-fade-in">
      {/* ============================================================
       HEADER
       ============================================================ */}
      <Group justify="space-between" wrap="wrap" gap="sm">
        <Stack gap={2}>
          <Title
            order={2}
            className="bg-linear-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent tracking-tight"
          >
            Tablero de Indicadores
          </Title>
          <Group gap="xs">
            {lastUpdated && (
              <Text size="xs" c="zinc.5">
                Actualizado: {dayjs(lastUpdated).format("DD/MM/YYYY HH:mm:ss")}
              </Text>
            )}
          </Group>
        </Stack>
        <Group gap="xs">
          {/* Filtro por almacen */}
          <Select
            placeholder="Todos los almacenes"
            data={[
              { value: "", label: "Todos los almacenes" },
              ...almacenes.map((a) => ({
                value: String(a.id_almacen),
                label: a.nombre,
              })),
            ]}
            value={idAlmacenFiltro ?? ""}
            onChange={(val) => setIdAlmacenFiltro(val || null)}
            leftSection={
              loadingAlmacenes ? (
                <Loader size="xs" />
              ) : (
                <BuildingStorefrontIcon className="w-4 h-4 text-zinc-400" />
              )
            }
            clearable
            radius="lg"
            size="sm"
            w={220}
            classNames={{
              input:
                "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 text-white",
              dropdown: "bg-zinc-900 border-zinc-800",
              option: "text-zinc-300 hover:bg-zinc-800",
            }}
          />
          <ActionIcon
            size="md"
            variant="light"
            color="indigo"
            radius="lg"
            onClick={recargar}
            loading={loading}
            className="shadow-md"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </ActionIcon>
          <Button
            size="xs"
            variant="light"
            color="teal"
            radius="lg"
            leftSection={<ArrowDownTrayIcon className="w-4 h-4" />}
            onClick={handleExportExcel}
            loading={exporting === "excel"}
            className="shadow-sm"
          >
            Excel
          </Button>
          <Button
            size="xs"
            variant="light"
            color="indigo"
            radius="lg"
            leftSection={<PrinterIcon className="w-4 h-4" />}
            onClick={handleExportPdf}
            loading={exporting === "pdf"}
            className="shadow-sm"
          >
            PDF
          </Button>
        </Group>
      </Group>

      {/* ERROR */}
      {error && (
        <Card padding="md" className="bg-red-500/10 border border-red-500/40">
          <Stack gap={4}>
            <Group gap="xs">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
              <Text size="sm" fw={700} c="red.3">
                No se pudieron cargar los indicadores
              </Text>
            </Group>
            <Text size="xs" c="red.3" className="ml-7">
              {error}
            </Text>
            <Text size="xs" c="zinc.5" className="ml-7">
              Si acabas de crear las vistas SQL en phpMyAdmin, espera unos
              segundos y presiona el boton de refrescar arriba a la derecha.
            </Text>
          </Stack>
        </Card>
      )}

      {/* ============================================================
       SECCION 1: OPERACION DEL DIA A DIA
       4 KPI grandes con delta vs periodo anterior.
       ============================================================ */}
      <section>
        <SectionHeader
          titulo="Operacion del Dia a Dia"
          subtitulo="Resumen de la actividad reciente de la operacion"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiWithDelta
            title="Pedidos del Mes"
            value={fmtNum(kpis?.req_ultimos_30_dias ?? 0)}
            deltaPct={deltaPedidosPct}
            mayorEsMejor
            icon={ShoppingCartIcon}
            color="indigo"
            descripcion="De los ultimos 30 dias"
          />
          <KpiWithDelta
            title="Tiempo de Despacho"
            value={fmtTiempo(kpis?.tda_minutos_promedio)}
            icon={ClockIcon}
            color="cyan"
            descripcion="Promedio en minutos de atención"
          />
          <KpiWithDelta
            title="Valor del Inventario"
            value={fmtMoney(kpis?.stock_valorizado_total)}
            icon={CubeTransparentIcon}
            color="teal"
            descripcion="Total de stock por su costo unitario"
          />
          <KpiWithDelta
            title="Productos en Alerta"
            value={fmtNum(kpis?.alertas_stock_critico ?? 0)}
            icon={ExclamationTriangleIcon}
            color={
              (kpis?.alertas_stock_critico ?? 0) === 0
                ? "green"
                : (kpis?.alertas_stock_critico ?? 0) <= 5
                  ? "yellow"
                  : "red"
            }
            descripcion="Productos SIN STOCK o CRITICO"
          />
        </div>
      </section>

      {/* ============================================================
       SECCION 2: CUMPLIMIENTO DE METAS
       2 gauges custom (TDA + Exactitud)
       ============================================================ */}
      <section>
        <SectionHeader
          titulo="Cumplimiento de Objetivos"
          subtitulo="Como estamos respecto a los objetivos del negocio"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card
            padding="lg"
            radius="xl"
            className="bg-zinc-900/40 border border-zinc-800/80"
          >
            <Stack gap="md" align="center">
              <Stack gap={2} align="center">
                <Text
                  size="xs"
                  fw={800}
                  c="zinc.5"
                  className="uppercase tracking-widest"
                >
                  Tiempo de Despacho
                </Text>
                <Text size="10px" c="zinc.6" fs="italic">
                  Objetivo: 12 minutos por pedido
                </Text>
              </Stack>
              <GaugeProgress
                value={kpis?.tda_minutos_promedio ?? 0}
                target={12}
                unidadInteligente
                mayorEsMejor={false}
                size={200}
                descripcion="Promedio en minutos desde que se crea el requerimiento hasta que se entrega por primera vez."
              />
            </Stack>
          </Card>

          <Card
            padding="lg"
            radius="xl"
            className="bg-zinc-900/40 border border-zinc-800/80"
          >
            <Stack gap="md" align="center">
              <Stack gap={2} align="center">
                <Text
                  size="xs"
                  fw={800}
                  c="zinc.5"
                  className="uppercase tracking-widest"
                >
                  Exactitud del Registro
                </Text>
                <Text size="10px" c="zinc.6" fs="italic">
                  Objetivo: 98% de coincidencia
                </Text>
              </Stack>
              <GaugeProgress
                value={kpis?.edi_porcentaje ?? 0}
                target={98}
                unit="%"
                mayorEsMejor
                size={200}
                descripcion="Porcentaje de coincidencia entre lo solicitado por el almacenero y lo realmente despachado."
              />
            </Stack>
          </Card>
        </div>
      </section>

      {/* ============================================================
       SECCION 3: TENDENCIAS
       3 KPI cards con mini sparklines (Recharts directo)
       ============================================================ */}
      <section>
        <SectionHeader
          titulo="Tendencias de los Ultimos 6 Meses"
          subtitulo="Evolucion mes a mes de los principales indicadores"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiWithSparkline
            title="Tendencia de Pedidos"
            value={fmtNum(
              tendencias[tendencias.length - 1]?.total_req ?? 0,
            )}
            descripcion="Creados mensualmente en los ultimos 6 meses"
            serie={sparklinePedidos}
            color="#6366f1"
            icon={ShoppingCartIcon}
          />
          <KpiWithSparkline
            title="Tendencia de Entregas"
            value={fmtNum(
              tendencias[tendencias.length - 1]?.entregas_mes ?? 0,
            )}
            descripcion="Pedidos completados mensualmente en los ultimos 6 meses"
            serie={sparklineEntregas}
            color="#10b981"
            icon={ClipboardDocumentCheckIcon}
          />
          <KpiWithSparkline
            title="Tendencia del Stock"
            value={fmtNum(
              tendencias[tendencias.length - 1]?.stock_neto_mes ?? 0,
            )}
            descripcion="Diferencia del mes: ingresos menos salidas"
            serie={sparklineFlujoNeto}
            color="#06b6d4"
            icon={ArrowsRightLeftIcon}
          />
        </div>
      </section>

      {/* ============================================================
       SECCION 4: DISTRIBUCIONES
       Top 5 alertas + BarChart de pedidos vs entregas por mes
       ============================================================ */}
      <section>
        <SectionHeader
          titulo="Distribuciones y Top"
          subtitulo="Que productos requieren atencion y como se comporta el flujo"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Top 5 alertas */}
          <Card
            padding="lg"
            radius="xl"
            className="bg-zinc-900/40 border border-zinc-800/80"
          >
            <Stack gap="md">
              <Group justify="space-between">
                <Stack gap={2}>
                  <Text
                    size="xs"
                    fw={800}
                    c="zinc.5"
                    className="uppercase tracking-widest"
                  >
                    Top 5 Productos que Requieren Reabastecimiento
                  </Text>
                  <Text size="10px" c="zinc.6" fs="italic">
                    Ordenados por criticidad (sin stock primero)
                  </Text>
                </Stack>
                <Badge color="red" variant="light" radius="sm">
                  {alertas.length} alertas
                </Badge>
              </Group>

              {topAlertas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-zinc-500">
                  <ExclamationTriangleIcon className="w-10 h-10 text-green-500 mb-2" />
                  <Text size="sm" fw={600}>
                    Sin alertas activas
                  </Text>
                  <Text size="xs">
                    Todos los productos tienen stock por encima del minimo
                  </Text>
                </div>
              ) : (
                <Stack gap="xs">
                  {topAlertas.map((a, i) => (
                    <div
                      key={`${a.id_producto}-${a.id_almacen}`}
                      className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-zinc-950/40 border border-zinc-800/60 hover:bg-zinc-900/40 transition-colors"
                    >
                      <Group gap="sm" wrap="nowrap" className="flex-1 min-w-0">
                        <div className="w-7 h-7 shrink-0 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                          {i + 1}
                        </div>
                        <Stack gap={0} className="min-w-0">
                          <Group gap={4} wrap="nowrap">
                            <Text
                              size="sm"
                              fw={700}
                              className="text-zinc-100 truncate"
                            >
                              {a.producto}
                            </Text>
                            <Text size="10px" c="zinc.5" className="truncate">
                              · {a.almacen}
                            </Text>
                          </Group>
                          <Text size="10px" c="zinc.5">
                            Stock {formatNumber(a.stock_actual_base, 2)}{" "}
                            {a.unidad_base_abv} / min{" "}
                            {formatNumber(a.stock_minimo_base, 2)}{" "}
                            {a.unidad_base_abv}
                          </Text>
                        </Stack>
                      </Group>
                      <Badge
                        color={COLOR_NIVEL[a.nivel_alerta]}
                        variant="light"
                        radius="sm"
                        size="sm"
                        className="font-bold uppercase tracking-wider shrink-0"
                      >
                        {a.nivel_alerta}
                      </Badge>
                    </div>
                  ))}
                </Stack>
              )}
            </Stack>
          </Card>

          {/* BarChart pedidos vs entregas por mes */}
          <Card
            padding="lg"
            radius="xl"
            className="bg-zinc-900/40 border border-zinc-800/80"
          >
            <Stack gap="md">
              <Group justify="space-between">
                <Stack gap={2}>
                  <Text
                    size="xs"
                    fw={800}
                    c="zinc.5"
                    className="uppercase tracking-widest"
                  >
                    Pedidos por Mes
                  </Text>
                
                </Stack>
                <Group gap="xs">
                  <Badge color="indigo" variant="light" radius="sm" size="xs">
                    Creados
                  </Badge>
                  <Badge color="teal" variant="light" radius="sm" size="xs">
                    Completados
                  </Badge>
                  <Badge color="orange" variant="light" radius="sm" size="xs">
                    En Despacho
                  </Badge>
                </Group>
              </Group>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={pedidosChartData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  barCategoryGap="22%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(63,63,70,0.4)" vertical={false} />
                  <XAxis
                    dataKey="mes"
                    stroke="#a1a1aa"
                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#a1a1aa"
                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <RTooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(99,102,241,0.1)" }}
                  />
                  <Bar dataKey="Pedidos" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Completados" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="En Despacho" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Stack>
          </Card>
        </div>
      </section>

      {/* ============================================================
       SECCION 5: RESUMEN EJECUTIVO
       Parrafo generado a partir de los datos.
       ============================================================ */}
      <section>
        <SectionHeader
          titulo="Lo que Necesitas Saber"
          subtitulo="Resumen generado a partir de los datos del dia"
        />
        <InsightsBanner
          kpis={kpis}
          alertas={alertas}
          tapAlmacen={tapAlmacen}
        />
      </section>

      {/* FOOTER */}
      <Text size="10px" c="zinc.6" fs="italic" ta="center" mt="md">
        Los datos se refrescan automaticamente cada 5 minutos. Ultima
        actualizacion: {dayjs(lastUpdated ?? new Date()).format("DD/MM/YYYY HH:mm:ss")}.
      </Text>
    </Stack>
  );
};

// -----------------------------------------------------------------------------
// Sub-componente local: header de seccion
// -----------------------------------------------------------------------------
const SectionHeader = ({
  titulo,
  subtitulo,
}: {
  titulo: string;
  subtitulo?: string;
}) => (
  <Stack gap={4} mb={4}>
    <Group gap="xs" align="center">
      <div className="w-1.5 h-5 bg-linear-to-b from-indigo-500 to-indigo-700 rounded-full" />
      <Text fw={800} className="text-zinc-100 tracking-tight">
        {titulo}
      </Text>
    </Group>
    {subtitulo && (
      <Text size="xs" c="zinc.5" className="ml-5">
        {subtitulo}
      </Text>
    )}
    <Divider className="border-zinc-800/60 mt-1" />
  </Stack>
);