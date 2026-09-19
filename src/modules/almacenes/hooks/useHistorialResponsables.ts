import { useState, useEffect, useMemo, useCallback } from "react";
import { useNotify } from "../../../hooks/useNotify";
import { AlmacenesService } from "../service/almacenes.service";
import type { RES_ResponsableAlmacen } from "../service/almacenes.responses";
import { EstadoBase } from "../../../shared/enums/_generic/estado-base";
import dayjs from "dayjs";

export const useHistorialResponsables = (id_almacen: number) => {
  const { notify } = useNotify();
  const [responsables, setResponsables] = useState<RES_ResponsableAlmacen[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [loadingInactivando, setLoadingInactivando] = useState<number | null>(
    null,
  );

  const listar = useCallback(async () => {
    setLoading(true);
    try {
      const result =
        await AlmacenesService.get_historial_responsables(id_almacen);
      if (result.success) {
        setResponsables(result.data);
      } else {
        notify({ type: "error", content: result.message });
      }
    } catch (error) {
      notify({
        type: "error",
        content: "Error al cargar el historial de responsables",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id_almacen, notify]);

  useEffect(() => {
    listar();
  }, [listar]);

  const handleSuccess = (
    nuevo: RES_ResponsableAlmacen,
    onUpdateResponsable?: (nombre: string) => void,
  ) => {
    setResponsables((prev) => [nuevo, ...prev]);
    if (onUpdateResponsable) onUpdateResponsable(nuevo.nombre_completo);
  };

  const handleInactivarResponsable = async (idResponsable: number) => {
    const fechaFin = dayjs().format("YYYY-MM-DD");
    setLoadingInactivando(idResponsable);

    try {
      const res = await AlmacenesService.inactivar_responsable({
        id_responsable_almacen: idResponsable,
        fecha_fin: fechaFin,
      });

      if (res.success) {
        setResponsables((prev) =>
          prev.map((r) =>
            r.id_responsable_almacen === idResponsable
              ? { ...r, estado: EstadoBase.Inactivo, fecha_fin: fechaFin }
              : r,
          ),
        );
        notify({ type: "success", content: "Responsable inactivado" });
        return true;
      } else {
        notify({ type: "error", content: res.message });
      }
    } catch {
      notify({ type: "error", content: "Error al inactivar responsable" });
    } finally {
      setLoadingInactivando(null);
    }
    return false;
  };

  const responsablesOrdenados = useMemo(() => {
    return [...responsables].sort((a, b) => {
      const aAtivo = a.estado?.toUpperCase() === "ACTIVO" ? 1 : 0;
      const bAtivo = b.estado?.toUpperCase() === "ACTIVO" ? 1 : 0;

      if (aAtivo !== bAtivo) {
        return bAtivo - aAtivo; // Activos primero
      }

      // Desempate por fecha de inicio descendente
      return dayjs(b.fecha_inicio).unix() - dayjs(a.fecha_inicio).unix();
    });
  }, [responsables]);

  return {
    responsables: responsablesOrdenados,
    loading,
    loadingInactivando,
    handleSuccess,
    handleInactivarResponsable,
  };
};
