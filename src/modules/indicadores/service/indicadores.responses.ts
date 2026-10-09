/**
 * DTOs de respuesta del modulo BI (Indicadores).
 * Mapean al 100% las vistas SQL v_bi_* del backend.
 */

// -----------------------------------------------------------------------------
// GET /api/indicadores/generales -> v_bi_kpis_principales
// -----------------------------------------------------------------------------
export interface RES_KPIsGenerales {
  req_ultimos_30_dias: number;
  /** Pedidos en los 30 dias ANTERIORES (entre -60 y -30) para calcular delta. */
  req_30_dias_anteriores: number;
  req_cerrados_total: number;
  /** TDA: Tiempo de Despacho promedio (minutos). null si sin datos. */
  tda_minutos_promedio: number | null;
  /** EDI: % exactitud del registro. null si sin req Completados. */
  edi_porcentaje: number | null;
  /** CTL: % de lotes con kardex. 0 si no hay lotes activos. */
  ctl_porcentaje: number;
  /** Stock valorizado total (S/.). */
  stock_valorizado_total: number;
  /** Cantidad de productos en SIN STOCK/CRITICO/BAJO. */
  alertas_stock_critico: number;
  /** Tasa de anulacion % sobre los ultimos 30 dias. */
  tasa_anulacion_pct: number;
  /** Fecha del ultimo movimiento kardex. null si sin movimientos. */
  tr_ultimo_movimiento_kardex: string | null;
}

// -----------------------------------------------------------------------------
// GET /api/indicadores/stock-valorizado -> v_bi_stock_valorizado
// -----------------------------------------------------------------------------
export interface RES_StockValorizado {
  id_almacen: number;
  almacen: string;
  productos_activos: number;
  unidades_base_total: number;
  valorizado: number;
  lotes_sin_stock: number;
}

// -----------------------------------------------------------------------------
// GET /api/indicadores/top-productos -> query parametrica (dias)
// -----------------------------------------------------------------------------
export interface RES_TopProducto {
  id_producto: number;
  producto: string;
  unidad_base_abv: string;
  total_despachado_base: number;
  num_movimientos: number;
  costo_total: number;
}

// -----------------------------------------------------------------------------
// GET /api/indicadores/rotacion-mensual -> query parametrica (meses)
// -----------------------------------------------------------------------------
export interface RES_RotacionMensual {
  mes: string;
  ingresos_base: number;
  salidas_base: number;
  costo_ingresos: number;
  costo_salidas: number;
  variacion_costo: number;
}

// -----------------------------------------------------------------------------
// GET /api/indicadores/alertas-stock -> v_bi_alertas_stock
// -----------------------------------------------------------------------------
export type NivelAlerta = "SIN STOCK" | "CRITICO" | "BAJO";

export interface RES_AlertaStock {
  id_producto: number;
  producto: string;
  unidad_base_abv: string;
  stock_minimo_base: number;
  /** 0 si el producto no tiene lote en un almacen especifico. */
  id_almacen: number;
  almacen: string;
  stock_actual_base: number;
  /** Positivo cuando falta stock, negativo cuando sobra. */
  deficit_base: number;
  nivel_alerta: NivelAlerta;
}

// -----------------------------------------------------------------------------
// GET /api/indicadores/tap-por-almacen -> v_bi_tap_por_almacen
// -----------------------------------------------------------------------------
export interface RES_TAPPorAlmacen {
  id_almacen: number;
  almacen: string;
  req_atendidos: number;
  tap_minutos: number;
  cumplimiento_tda: "CUMPLE" | "EN RANGO" | "FUERA DE META";
}

// -----------------------------------------------------------------------------
// GET /api/indicadores/tendencias-mensuales -> v_bi_tendencias_mensuales
// Ultimos 6 meses. Cada fila es un mes (formato YYYY-MM).
// -----------------------------------------------------------------------------
export interface RES_TendenciaMensual {
  mes: string;
  total_req: number;
  /** Pedidos que tienen TODAS sus lineas entregadas. */
  entregas_mes: number;
  /** Pedidos que tienen entregas parciales pero no estan cerrados. */
  en_despacho: number;
  ingresos_base: number;
  salidas_base: number;
  /** Diferencia del mes (ingresos - salidas), sin acumular. */
  stock_neto_mes: number;
  /** Stock neto acumulado en unidades base (historico). */
  stock_neto_acum_base: number;
}