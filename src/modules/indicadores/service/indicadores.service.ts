import { api } from "../../../service/_api";
import type { IRespuesta } from "../../../shared/interfaces/_response";
import type {
  RES_AlertaStock,
  RES_KPIsGenerales,
  RES_RotacionMensual,
  RES_StockValorizado,
  RES_TAPPorAlmacen,
  RES_TendenciaMensual,
  RES_TopProducto,
} from "./indicadores.responses";

const path = "/indicadores";

/**
 * Helper para construir params con id_almacen opcional.
 */
const buildParams = (idAlmacen?: number | null): Record<string, number> => {
  const p: Record<string, number> = {};
  if (idAlmacen !== undefined && idAlmacen !== null) {
    p.id_almacen = idAlmacen;
  }
  return p;
};

export const IndicadoresService = {
  /** KPIs principales (1 fila resumen). */
  obtenerGenerales: async (idAlmacen?: number | null) => {
    const res = await api.get<IRespuesta<RES_KPIsGenerales>>(
      `${path}/generales`,
      { params: buildParams(idAlmacen) },
    );
    return res.data;
  },

  /** Stock valorizado por almacen (opcional filtrado). */
  obtenerStockValorizado: async (idAlmacen?: number | null) => {
    const res = await api.get<IRespuesta<RES_StockValorizado[]>>(
      `${path}/stock-valorizado`,
      { params: buildParams(idAlmacen) },
    );
    return res.data;
  },

  /** Top 10 productos mas despachados. */
  obtenerTopProductos: async (dias: number = 30, idAlmacen?: number | null) => {
    const res = await api.get<IRespuesta<RES_TopProducto[]>>(
      `${path}/top-productos`,
      { params: { dias, ...buildParams(idAlmacen) } },
    );
    return res.data;
  },

  /** Ingresos vs Salidas por mes. */
  obtenerRotacionMensual: async (meses: number = 12, idAlmacen?: number | null) => {
    const res = await api.get<IRespuesta<RES_RotacionMensual[]>>(
      `${path}/rotacion-mensual`,
      { params: { meses, ...buildParams(idAlmacen) } },
    );
    return res.data;
  },

  /** Alertas de stock (SIN STOCK / CRITICO / BAJO). */
  obtenerAlertasStock: async (idAlmacen?: number | null) => {
    const res = await api.get<IRespuesta<RES_AlertaStock[]>>(
      `${path}/alertas-stock`,
      { params: buildParams(idAlmacen) },
    );
    return res.data;
  },

  /** TAP por almacen. */
  obtenerTAPPorAlmacen: async (idAlmacen?: number | null) => {
    const res = await api.get<IRespuesta<RES_TAPPorAlmacen[]>>(
      `${path}/tap-por-almacen`,
      { params: buildParams(idAlmacen) },
    );
    return res.data;
  },

  /** Tendencias mensuales para sparklines (ultimos 6 meses). */
  obtenerTendenciasMensuales: async (idAlmacen?: number | null) => {
    const res = await api.get<IRespuesta<RES_TendenciaMensual[]>>(
      `${path}/tendencias-mensuales`,
      { params: buildParams(idAlmacen) },
    );
    return res.data;
  },
};