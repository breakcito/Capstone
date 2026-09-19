import { useState, useCallback, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { KardexService } from "../service/kardex.service";
import type { RES_MovimientoKardex } from "../service/kardex.responses";
import { AuxService } from "../../../service/auxiliar.service";
import type { RES_Almacen } from "../../../service/responses/almacen";
import { useAuthStore } from "../../../stores/auth.store";
import { useAuditoriaStore } from "../../../stores/auditoria.store";

export const useKardex = () => {
  const { en_modo_auditable } = useAuditoriaStore();
  // -- Estados de Filtro Principal (Periodo y Almacén) --
  const [idAlmacen, setIdAlmacen] = useState<string | null>(null);
  const [mes, setMes] = useState<string>(dayjs().format("M"));
  const [yearcito, setYearcito] = useState<string>(dayjs().format("YYYY"));

  // -- Estados de Catálogos --
  const [almacenes, setAlmacenes] = useState<RES_Almacen[]>([]);
  const [loadingAlmacenes, setLoadingAlmacenes] = useState(false);

  // -- Estados de Filtros Locales y Búsqueda --
  const [busqueda, setBusqueda] = useState("");
  const [filtroProducto, setFiltroProducto] = useState<string | null>(null);
  const [filtroLote, setFiltroLote] = useState<string | null>(null);

  // -- Estado de Datos --
  const [movimientos, setMovimientos] = useState<RES_MovimientoKardex[]>([]);
  const [loadingMovimientos, setLoadingMovimientos] = useState(false);
  const [error, setError] = useState("");

  // 1. Obtener Almacenes Autorizados
  const loadAlmacenes = useCallback(async () => {
    setLoadingAlmacenes(true);
    setError("");
    try {
      const res = await AuxService.get_almacenes({
        id_empleado_responsable: useAuthStore.getState().usuario?.id_empleado,
      });
      if (res.success) {
        setAlmacenes(res.data);
        // Auto-seleccionar primer almacén si no hay uno seleccionado
        if (res.data.length > 0) {
          setIdAlmacen((prev) => prev || String(res.data[0].id_almacen));
        }
      } else {
        setError(res.message || "Error al cargar almacenes");
      }
    } catch {
      setError("Error de conexión al cargar almacenes");
    } finally {
      setLoadingAlmacenes(false);
    }
  }, []);

  // 2. Cargar Movimientos (Kardex)
  const loadMovimientos = useCallback(async () => {
    if (!idAlmacen || !mes || !yearcito) {
      setMovimientos([]);
      return;
    }

    setLoadingMovimientos(true);
    setError("");
    try {
      const res = await KardexService.listarPorAlmacen(
        Number(idAlmacen),
        Number(mes),
        Number(yearcito),
      );
      if (res.success) {
        setMovimientos(res.data);
      } else {
        setMovimientos([]);
        setError(res.message || "Error al cargar movimientos");
      }
    } catch {
      setMovimientos([]);
      setError("Error de conexión al cargar movimientos");
    } finally {
      setLoadingMovimientos(false);
    }
  }, [idAlmacen, mes, yearcito]);

  // Cargar almacenes al montar
  useEffect(() => {
    loadAlmacenes();
  }, [loadAlmacenes]);

  // Cargar movimientos al cambiar periodo o almacén
  useEffect(() => {
    loadMovimientos();
  }, [loadMovimientos]);

  // Resetear filtros locales al cambiar almacén
  useEffect(() => {
    setFiltroProducto(null);
    setFiltroLote(null);
    setBusqueda("");
  }, [idAlmacen]);

  // -- Lógica de Filtrado y Opciones --

  const productosUnicos = useMemo(() => {
    const unique = new Set(movimientos.map((m) => m.producto).filter(Boolean));
    return Array.from(unique)
      .sort()
      .map((p) => ({ value: String(p), label: String(p) }));
  }, [movimientos]);

  const lotesUnicos = useMemo(() => {
    const source = filtroProducto
      ? movimientos.filter((m) => m.producto === filtroProducto)
      : movimientos;

    const unique = new Set(
      source.map((m) => String(m.correlativo_lote)).filter(Boolean),
    );
    return Array.from(unique)
      .sort()
      .map((l) => ({ value: l, label: l }));
  }, [movimientos, filtroProducto]);

  const filteredRecords = useMemo(() => {
    const filtered = movimientos.filter((m) => {
      // Filtro modo auditoría
      if (en_modo_auditable && m.es_auditable) return false;

      const matchProducto = !filtroProducto || m.producto === filtroProducto;
      const matchLote = !filtroLote || String(m.correlativo_lote) === filtroLote;

      const q = busqueda.toLowerCase().trim();
      const matchBusqueda =
        !q ||
        (m.descripcion || "").toLowerCase().includes(q) ||
        (m.producto || "").toLowerCase().includes(q) ||
        (String(m.correlativo_lote) || "").toLowerCase().includes(q) ||
        (m.categoria || "").toLowerCase().includes(q);

      return matchProducto && matchLote && matchBusqueda;
    });

    // Ordenar de más reciente a más antiguo por fecha
    return filtered.sort((a, b) => dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf());
  }, [movimientos, busqueda, filtroProducto, filtroLote, en_modo_auditable]);

  return {
    // Estados y Setters para la UI
    idAlmacen,
    setIdAlmacen,
    mes,
    setMes,
    yearcito,
    setYearcito,
    busqueda,
    setBusqueda,
    filtroProducto,
    setFiltroProducto,
    filtroLote,
    setFiltroLote,

    // Datos Procesados
    movimientos,
    filteredRecords,
    almacenes,
    productosUnicos,
    lotesUnicos,

    // Estados de Carga y Error
    loadingMovimientos,
    loadingAlmacenes,
    error,

    // Métodos Manuales (si se requieren)
    loadMovimientos,
    recargar: loadMovimientos,
  };
};
