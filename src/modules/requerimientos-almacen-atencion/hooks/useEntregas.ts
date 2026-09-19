import { useState, useCallback, useMemo, useEffect } from "react";
import type { AxiosError } from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { AtencionService } from "../service/atencion.service";
import type { RES_RequerimientoAlmacen } from "../../../service/responses/requerimientos-almacen/requerimiento-almacen";
import { AuxService } from "../../../service/auxiliar.service";
import { useAuthStore } from "../../../stores/auth.store";
import { useAuditoriaStore } from "../../../stores/auditoria.store";

export interface IUseHook {
  setError: (msg: string) => void;
}

export const useEntregas = ({ setError: externalSetError }: IUseHook) => {
  const navigate = useNavigate();
  const { en_modo_auditable } = useAuditoriaStore();
  // -- Estados de Catálogos --
  const [almacenes, setAlmacenes] = useState<
    { id_almacen: number; nombre: string }[]
  >([]);
  const [loadingAlmacenes, setLoadingAlmacenes] = useState(false);

  // -- Estados de la Vista (Atención Page) --
  const [idAlmacen, setIdAlmacen] = useState<string | null>(null);
  const [mes, setMes] = useState<string>(dayjs().format("M"));
  const [yearcito, setYearcito] = useState<string>(dayjs().format("YYYY"));

  const [data, setData] = useState<RES_RequerimientoAlmacen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // Sincronizar error externo si es necesario
  useEffect(() => {
    if (error && externalSetError) externalSetError(error);
  }, [error, externalSetError]);

  // 0. Obtener Almacenes Autorizados (donde es responsable)
  const obtenerAlmacenesAutorizados = useCallback(async () => {
    setLoadingAlmacenes(true);
    try {
      const resp = await AuxService.get_almacenes({
        id_empleado_responsable: useAuthStore.getState().usuario?.id_empleado,
        es_principal: false,
      });
      if (resp.success) {
        setAlmacenes(resp.data);
        // Solo auto-elegimos si no hay uno ya seleccionado
        if (resp.data.length > 0) {
          setIdAlmacen((prev) => prev ?? String(resp.data[0].id_almacen));
        }
        return resp.data;
      }
      return [];
    } catch {
      return [];
    } finally {
      setLoadingAlmacenes(false);
    }
  }, []);

  // -- Carga Inicial de Catálogos --

  useEffect(() => {
    obtenerAlmacenesAutorizados();
  }, [obtenerAlmacenesAutorizados]);

  // -- Lógica de Carga de Datos --
  const loadData = useCallback(async () => {
    if (!idAlmacen || !mes || !yearcito) return;
    setLoading(true);
    setError("");
    try {
      const dataResp = await AtencionService.obtenerRequerimientos(
        idAlmacen,
        mes,
        yearcito,
      );
      if (dataResp.success) {
        setData(dataResp.data || []);
      } else {
        setError(dataResp.message || "Error al obtener requerimientos");
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (axiosError.response?.status === 401) navigate("/login");
      setError(axiosError.response?.data?.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [idAlmacen, mes, yearcito, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // -- Filtrado --
  const filteredRecords = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    const result = data.filter((p) => !(en_modo_auditable && p.es_auditable));
    if (!q) return result;
    return result.filter(
      (item) =>
        item.correlativo.toLowerCase().includes(q) ||
        item.solicitante.toLowerCase().includes(q) ||
        item.labor.toLowerCase().includes(q),
    );
  }, [data, busqueda, en_modo_auditable]);

  // -- Local State Updates --
  const updateRequirementLocal = useCallback(
    (id: number, newData: Partial<RES_RequerimientoAlmacen>) => {
      setData((prev) =>
        prev.map((item) =>
          item.id_requerimiento === id ? { ...item, ...newData } : item,
        ),
      );
    },
    [],
  );

  const addRequirementLocal = useCallback(
    (newItem: RES_RequerimientoAlmacen) => {
      setData((prev) => [newItem, ...prev]);
    },
    [],
  );

  return {
    // Estados
    idAlmacen,
    setIdAlmacen,
    mes,
    setMes,
    yearcito,
    setYearcito,
    busqueda,
    setBusqueda,
    data,
    filteredRecords,
    loading,
    error,
    setError,

    // Métodos
    loadData,
    recargar: loadData,
    obtenerAlmacenesAutorizados,
    updateRequirementLocal,
    addRequirementLocal,

    // Catálogos
    almacenes,
    loadingAlmacenes,
  };
};
