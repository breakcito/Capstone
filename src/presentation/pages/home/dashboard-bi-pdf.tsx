import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import type {
  RES_AlertaStock,
  RES_KPIsGenerales,
  RES_StockValorizado,
  RES_TAPPorAlmacen,
  RES_TopProducto,
} from "../../../modules/indicadores/service/indicadores.responses";

/**
 * Documento PDF del Dashboard BI (reporte ejecutivo).
 *
 * Componente PURO: recibe todos los datos como props desde el caller.
 * No usa hooks porque @react-pdf/renderer renderiza de forma sincrona:
 * si dejara un useEffect async, el PDF saldria con datos sin poblar.
 */
interface DashboardBIPdfProps {
  kpis: RES_KPIsGenerales | null;
  stockValorizado: RES_StockValorizado[];
  topProductos: RES_TopProducto[];
  alertas: RES_AlertaStock[];
  tapAlmacen: RES_TAPPorAlmacen[];
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#0F172A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 10,
    borderBottom: "2pt solid #1E3A8A",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#1E3A8A" },
  subtitle: { fontSize: 9, color: "#64748B", marginTop: 2 },
  fecha: { fontSize: 8, color: "#64748B", textAlign: "right" },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginTop: 14,
    marginBottom: 6,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  kpiBox: {
    width: "24%",
    padding: 8,
    margin: 4,
    border: "1pt solid #CBD5E1",
    borderRadius: 4,
  },
  kpiLabel: { fontSize: 7, color: "#64748B", textTransform: "uppercase" },
  kpiValue: { fontSize: 14, fontWeight: "bold", color: "#0F172A", marginTop: 2 },
  kpiMeta: { fontSize: 7, color: "#64748B", marginTop: 2 },
  table: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginTop: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    borderBottomStyle: "solid",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#EEF2FF",
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    borderBottomStyle: "solid",
    fontWeight: "bold",
  },
  cell: { padding: 4, fontSize: 8 },
  cellHeader: { padding: 4, fontSize: 8, fontWeight: "bold" },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 32,
    right: 32,
    fontSize: 7,
    color: "#94A3B8",
    textAlign: "center",
    borderTop: "1pt solid #E2E8F0",
    paddingTop: 4,
  },
});

const fmt = (v: number | null | undefined, dec = 1): string => {
  if (v === null || v === undefined) return "—";
  return Number(v).toFixed(dec);
};

const fmtMoney = (v: number | null | undefined): string => {
  if (v === null || v === undefined) return "—";
  return `S/. ${Number(v).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const DashboardBIPdf = ({
  kpis,
  stockValorizado,
  topProductos,
  alertas,
  tapAlmacen,
}: DashboardBIPdfProps) => {
  const fechaGen = dayjs().format("DD/MM/YYYY HH:mm");

  return (
    <Document
      title={`Dashboard BI Cupper & Hannia - ${fechaGen}`}
      author="Capstone - Grupo 02"
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              Dashboard de Business Intelligence
            </Text>
            <Text style={styles.subtitle}>
              Corporacion de Servicios Cupper & Hannia E.I.R.L. - Modulo BI
              del sistema de control de pedidos al almacen
            </Text>
          </View>
          <View>
            <Text style={styles.fecha}>Generado: {fechaGen}</Text>
            <Text style={styles.fecha}>
              Confidencial - uso interno
            </Text>
          </View>
        </View>

        {/* KPIs */}
        <Text style={styles.sectionTitle}>Indicadores Principales</Text>
        <View style={styles.kpiGrid}>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiLabel}>TDA - Tiempo Despacho</Text>
            <Text style={styles.kpiValue}>
              {fmt(kpis?.tda_minutos_promedio)} min
            </Text>
            <Text style={styles.kpiMeta}>Meta: &lt;= 12 min</Text>
          </View>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiLabel}>EDI - Exactitud</Text>
            <Text style={styles.kpiValue}>{fmt(kpis?.edi_porcentaje)}%</Text>
            <Text style={styles.kpiMeta}>Meta: &lt;= 2% discrepancia</Text>
          </View>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiLabel}>CTL - Trazabilidad</Text>
            <Text style={styles.kpiValue}>{fmt(kpis?.ctl_porcentaje)}%</Text>
            <Text style={styles.kpiMeta}>Meta: &gt;= 90%</Text>
          </View>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiLabel}>Stock Valorizado</Text>
            <Text style={styles.kpiValue}>
              {fmtMoney(kpis?.stock_valorizado_total)}
            </Text>
            <Text style={styles.kpiMeta}>
              {stockValorizado.length} almacenes
            </Text>
          </View>
        </View>

        <View style={styles.kpiGrid}>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiLabel}>Alertas de Stock</Text>
            <Text style={styles.kpiValue}>
              {kpis?.alertas_stock_critico ?? 0}
            </Text>
            <Text style={styles.kpiMeta}>
              Productos en SIN STOCK / CRITICO / BAJO
            </Text>
          </View>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiLabel}>Tasa de Anulacion</Text>
            <Text style={styles.kpiValue}>
              {fmt(kpis?.tasa_anulacion_pct)}%
            </Text>
            <Text style={styles.kpiMeta}>Ultimos 30 dias</Text>
          </View>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiLabel}>Requerimientos (30d)</Text>
            <Text style={styles.kpiValue}>
              {kpis?.req_ultimos_30_dias ?? 0}
            </Text>
            <Text style={styles.kpiMeta}>Excluyendo anulados</Text>
          </View>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiLabel}>Requerimientos Cerrados</Text>
            <Text style={styles.kpiValue}>
              {kpis?.req_cerrados_total ?? 0}
            </Text>
            <Text style={styles.kpiMeta}>Total historico</Text>
          </View>
        </View>

        {/* STOCK VALORIZADO */}
        <Text style={styles.sectionTitle}>Stock Valorizado por Almacen</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cellHeader, { width: "40%" }]}>Almacen</Text>
            <Text style={[styles.cellHeader, { width: "15%" }]}>
              Productos activos
            </Text>
            <Text style={[styles.cellHeader, { width: "20%" }]}>
              Unidades base
            </Text>
            <Text style={[styles.cellHeader, { width: "25%" }]}>
              Valorizado (S/.)
            </Text>
          </View>
          {stockValorizado.map((s, i) => (
            <View
              key={s.id_almacen}
              style={[
                styles.tableRow,
                i % 2 === 0 ? { backgroundColor: "#FAFAFA" } : {},
              ]}
            >
              <Text style={[styles.cell, { width: "40%" }]}>{s.almacen}</Text>
              <Text style={[styles.cell, { width: "15%" }]}>
                {s.productos_activos}
              </Text>
              <Text style={[styles.cell, { width: "20%" }]}>
                {Number(s.unidades_base_total).toLocaleString()}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {fmtMoney(s.valorizado)}
              </Text>
            </View>
          ))}
        </View>

        {/* TOP PRODUCTOS */}
        <Text style={styles.sectionTitle}>
          Top 10 Productos mas Despachados (30 dias)
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cellHeader, { width: "50%" }]}>Producto</Text>
            <Text style={[styles.cellHeader, { width: "10%" }]}>U.M.</Text>
            <Text style={[styles.cellHeader, { width: "20%" }]}>
              Total despachado
            </Text>
            <Text style={[styles.cellHeader, { width: "20%" }]}>
              Costo total (S/.)
            </Text>
          </View>
          {topProductos.map((t, i) => (
            <View
              key={t.id_producto}
              style={[
                styles.tableRow,
                i % 2 === 0 ? { backgroundColor: "#FAFAFA" } : {},
              ]}
            >
              <Text style={[styles.cell, { width: "50%" }]}>{t.producto}</Text>
              <Text style={[styles.cell, { width: "10%" }]}>
                {t.unidad_base_abv}
              </Text>
              <Text style={[styles.cell, { width: "20%" }]}>
                {Number(t.total_despachado_base).toLocaleString()}
              </Text>
              <Text style={[styles.cell, { width: "20%" }]}>
                {fmtMoney(t.costo_total)}
              </Text>
            </View>
          ))}
        </View>

        {/* TAP POR ALMACEN */}
        <Text style={styles.sectionTitle}>
          Tiempo Promedio de Despacho por Almacen (TDA)
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cellHeader, { width: "40%" }]}>Almacen</Text>
            <Text style={[styles.cellHeader, { width: "20%" }]}>
              Req atendidos
            </Text>
            <Text style={[styles.cellHeader, { width: "20%" }]}>
              TAP (min)
            </Text>
            <Text style={[styles.cellHeader, { width: "20%" }]}>
              Cumplimiento
            </Text>
          </View>
          {tapAlmacen.map((t, i) => (
            <View
              key={t.id_almacen}
              style={[
                styles.tableRow,
                i % 2 === 0 ? { backgroundColor: "#FAFAFA" } : {},
              ]}
            >
              <Text style={[styles.cell, { width: "40%" }]}>{t.almacen}</Text>
              <Text style={[styles.cell, { width: "20%" }]}>
                {t.req_atendidos}
              </Text>
              <Text style={[styles.cell, { width: "20%" }]}>
                {fmt(t.tap_minutos)}
              </Text>
              <Text style={[styles.cell, { width: "20%" }]}>
                {t.cumplimiento_tda}
              </Text>
            </View>
          ))}
        </View>

        {/* ALERTAS */}
        <Text style={styles.sectionTitle}>
          Alertas de Stock ({alertas.length})
        </Text>
        {alertas.length === 0 ? (
          <Text style={{ fontSize: 9, color: "#16A34A", marginTop: 6 }}>
            No hay alertas activas. Todos los productos tienen stock por encima
            de su minimo.
          </Text>
        ) : (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.cellHeader, { width: "45%" }]}>
                Producto
              </Text>
              <Text style={[styles.cellHeader, { width: "15%" }]}>U.M.</Text>
              <Text style={[styles.cellHeader, { width: "15%" }]}>
                Stock actual
              </Text>
              <Text style={[styles.cellHeader, { width: "15%" }]}>
                Minimo
              </Text>
              <Text style={[styles.cellHeader, { width: "10%" }]}>Nivel</Text>
            </View>
            {alertas.slice(0, 20).map((a, i) => (
              <View
                key={a.id_producto}
                style={[
                  styles.tableRow,
                  i % 2 === 0 ? { backgroundColor: "#FAFAFA" } : {},
                ]}
              >
                <Text style={[styles.cell, { width: "45%" }]}>
                  {a.producto}
                </Text>
                <Text style={[styles.cell, { width: "15%" }]}>
                  {a.unidad_base_abv}
                </Text>
                <Text style={[styles.cell, { width: "15%" }]}>
                  {Number(a.stock_actual_base).toLocaleString()}
                </Text>
                <Text style={[styles.cell, { width: "15%" }]}>
                  {Number(a.stock_minimo_base).toLocaleString()}
                </Text>
                <Text style={[styles.cell, { width: "10%" }]}>
                  {a.nivel_alerta}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Capstone - Grupo 02 - Pagina ${pageNumber} de ${totalPages} - Generado ${fechaGen}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};