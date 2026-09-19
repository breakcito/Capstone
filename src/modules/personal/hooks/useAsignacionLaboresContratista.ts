import { useState, useCallback, useMemo } from "react";
import { useNotify } from "../../../hooks/useNotify";
import { ContratistasService } from "../service/empleados.service";
import { AuxService } from "../../../service/auxiliar.service";
import type { RES_ContratistaResumen } from "../service/empleados.responses";
import type { RES_Mina } from "../../../service/responses/mina";
import type { RES_Labor } from "../../../service/responses/labor";
import { EstadoBase } from "../../../shared/enums/_generic/estado-base";

export const useAsignacionLaboresContratista = (
  onUpdateLocal: (editado: RES_ContratistaResumen) => void,
) => {
  const { notify } = useNotify();

  const [contratista, setContratista] = useState<RES_ContratistaResumen | null>(
    null,
  );
  const [minas, setMinas] = useState<RES_Mina[]>([]);
  const [idMina, setIdMina] = useState<number | null>(null);
  const [laboresDisponibles, setLaboresDisponibles] = useState<RES_Labor[]>([]);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMinas, setLoadingMinas] = useState(false);
  const [loadingLabores, setLoadingLabores] = useState(false);

  const cargarMinas = useCallback(async () => {
    setLoadingMinas(true);
    try {
      const resp = await AuxService.get_minas();
      if (resp.success) setMinas(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMinas(false);
    }
  }, []);

  const cargarCatalogoLabores = useCallback(
    async (minaId: number) => {
      setLoadingLabores(true);
      try {
        const resp = await ContratistasService.get_labores_disponibles(minaId);
        if (resp.success) {
          setLaboresDisponibles(resp.data);
        }
      } catch (err) {
        console.error(err);
        notify({
          type: "error",
          content: "Error al cargar catálogo de labores",
        });
      } finally {
        setLoadingLabores(false);
      }
    },
    [notify],
  );

  const abrir = useCallback(
    async (emp: RES_ContratistaResumen) => {
      setContratista(emp);
      setIdMina(emp.id_mina || null);
      cargarMinas();

      if (emp.labores_asignadas && emp.labores_asignadas.length > 0) {
        const ids = emp.labores_asignadas
          .filter((l) => l.estado === EstadoBase.Activo)
          .map((l) => l.id_labor);
        setSeleccionados(ids);
      } else {
        setSeleccionados([]);
      }

      if (emp.id_mina) {
        cargarCatalogoLabores(emp.id_mina);
      }
    },
    [cargarCatalogoLabores, cargarMinas],
  );

  // Última asignación inactiva por id_labor (para mostrar el historial en línea).
  // Se conservan en el modal para que el usuario sepa que fueron asignadas antes
  // y pueda re-asignarlas si lo necesita.
  const inactiveLaborInfo = useMemo(() => {
    const map = new Map<
      number,
      { fecha_inicio: string; fecha_fin: string | null }
    >();
    if (!contratista?.labores_asignadas) return map;
    contratista.labores_asignadas
      .filter((l) => l.estado === EstadoBase.Inactivo)
      .forEach((l) =>
        map.set(l.id_labor, {
          fecha_inicio: l.fecha_inicio,
          fecha_fin: l.fecha_fin,
        }),
      );
    return map;
  }, [contratista]);

  const handleMinaChange = (val: number | null) => {
    setIdMina(val);
    setSeleccionados([]);
    setLaboresDisponibles([]);
    if (val) {
      cargarCatalogoLabores(val);
    }
  };

  const cerrar = () => {
    setContratista(null);
    setIdMina(null);
    setLaboresDisponibles([]);
    setSeleccionados([]);
  };

  const toggleSeleccion = (idLabor: number) => {
    setSeleccionados((prev) =>
      prev.includes(idLabor)
        ? prev.filter((id) => id !== idLabor)
        : [...prev, idLabor],
    );
  };

  const handleAsignar = async () => {
    if (!contratista) return;

    if (!idMina) {
      notify({ type: "info", content: "Debe seleccionar una mina" });
      return;
    }

    setLoading(true);
    try {
      const resp = await ContratistasService.asignar_labores(
        contratista.id_contratista,
        {
          id_mina: idMina,
          ids_labor: seleccionados,
        },
      );
      if (resp.success) {
        notify({ type: "success", content: resp.message });
        onUpdateLocal(resp.data);
        cerrar();
      } else {
        notify({ type: "error", content: resp.message });
      }
    } catch (err) {
      console.error(err);
      notify({ type: "error", content: "Error inesperado" });
    } finally {
      setLoading(false);
    }
  };

  return {
    contratista,
    minas,
    idMina,
    onMinaChange: handleMinaChange,
    laboresDisponibles,
    inactiveLaborInfo,
    seleccionados,
    loading,
    loadingMinas,
    loadingLabores,
    opened: contratista !== null,
    abrir,
    cerrar,
    toggleSeleccion,
    handleAsignar,
  };
};
