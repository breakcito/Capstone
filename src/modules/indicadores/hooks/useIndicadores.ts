import { useState, useCallback, useEffect } from "react";
import { IndicadoresService } from "../service/indicadores.service";
import type {
  RES_AlertaStock,
  RES_KPIsGenerales,
  RES_RotacionMensual,
  RES_StockValorizado,
  RES_TAPPorAlmacen,
  RES_TendenciaMensual,
  RES_TopProducto,
} from "../service/indicadores.responses";
import type { AxiosError } from "axios";

interface DashboardState {
  loading: boolean;
  error: string;
  kpis: RES_KPIsGenerales | null;
  stockValorizado: RES_StockValorizado[];
  topProductos: RES_TopProducto[];
  rotacion: RES_RotacionMensual[];
  alertas: RES_AlertaStock[];
  tapAlmacen: RES_TAPPorAlmacen[];
  tendencias: RES_TendenciaMensual[];
  /** Ultima vez que se cargo todo. */
  lastUpdated: Date | null;
}

/**
 * Hook maestro del Dashboard BI.
 *
 * - Carga los 6 endpoints en paralelo al montar.
 * - Acepta un filtro opcional por almacen. Si cambia, recarga todo.
 * - Expone `recargar()` para refresco manual desde la UI.
 * - Revalidacion automatica cada 5 minutos.
 */
export const useIndicadores = (idAlmacenFiltro: number | null = null) => {
  const [state, setState] = useState<DashboardState>({
    loading: true,
    error: "",
    kpis: null,
    stockValorizado: [],
    topProductos: [],
    rotacion: [],
    alertas: [],
    tapAlmacen: [],
    tendencias: [],
    lastUpdated: null,
  });

  const cargarTodo = useCallback(
    async (silent = false) => {
      if (!silent) setState((s) => ({ ...s, loading: true, error: "" }));

      try {
        const [
          generales,
          stockValorizado,
          topProductos,
          rotacion,
          alertas,
          tapAlmacen,
          tendencias,
        ] = await Promise.allSettled([
          IndicadoresService.obtenerGenerales(idAlmacenFiltro),
          IndicadoresService.obtenerStockValorizado(idAlmacenFiltro),
          IndicadoresService.obtenerTopProductos(30, idAlmacenFiltro),
          IndicadoresService.obtenerRotacionMensual(12, idAlmacenFiltro),
          IndicadoresService.obtenerAlertasStock(idAlmacenFiltro),
          IndicadoresService.obtenerTAPPorAlmacen(idAlmacenFiltro),
          IndicadoresService.obtenerTendenciasMensuales(idAlmacenFiltro),
        ]);

        const pickData = <T,>(
          r: PromiseSettledResult<{ success: boolean; data?: T }>,
          fallback: T,
        ): T => {
          if (r.status === "fulfilled" && r.value.success && r.value.data) {
            return r.value.data as T;
          }
          return fallback;
        };

        const pickKpis = (): RES_KPIsGenerales | null => {
          const r = generales;
          if (
            r.status === "fulfilled" &&
            r.value.success &&
            r.value.data
          ) {
            return (r.value.data as unknown) as RES_KPIsGenerales;
          }
          return null;
        };

        setState({
          loading: false,
          error: "",
          kpis: pickKpis(),
          stockValorizado: pickData<RES_StockValorizado[]>(stockValorizado, [] as RES_StockValorizado[]),
          topProductos: pickData<RES_TopProducto[]>(topProductos, [] as RES_TopProducto[]),
          rotacion: pickData<RES_RotacionMensual[]>(rotacion, [] as RES_RotacionMensual[]),
          alertas: pickData<RES_AlertaStock[]>(alertas, [] as RES_AlertaStock[]),
          tapAlmacen: pickData<RES_TAPPorAlmacen[]>(tapAlmacen, [] as RES_TAPPorAlmacen[]),
          tendencias: pickData<RES_TendenciaMensual[]>(tendencias, [] as RES_TendenciaMensual[]),
          lastUpdated: new Date(),
        });
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setState((s) => ({
          ...s,
          loading: false,
          error:
            axiosError.response?.data?.message ||
            "Error de conexion al cargar el Dashboard BI",
        }));
      }
    },
    [idAlmacenFiltro],
  );

  useEffect(() => {
    cargarTodo();
    const interval = setInterval(() => cargarTodo(true), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [cargarTodo]);

  return {
    ...state,
    recargar: () => cargarTodo(),
  };
};