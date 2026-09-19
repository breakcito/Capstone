import { useState, useEffect, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import { useNotify } from "../../../hooks/useNotify";
import { AlmacenesService } from "../service/almacenes.service";
import { Schema_NuevoResponsable } from "../service/almacenes.requests";
import type { RES_ResponsableAlmacen } from "../service/almacenes.responses";
import type { RES_Empleado } from "../../../service/responses/empleado";

export const useNuevoResponsable = (id_almacen: number) => {
  const { notify } = useNotify();
  const [loading, setLoading] = useState(false);

  // Empleados disponibles
  const [empleados, setEmpleados] = useState<RES_Empleado[]>([]);
  const [loadingEmpleados, setLoadingEmpleados] = useState(false);

  // Form
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<
    string | null
  >(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date());
  const [formError, setFormError] = useState("");

  const cargarEmpleados = useCallback(async () => {
    setLoadingEmpleados(true);
    try {
      const result = await AlmacenesService.get_empleados_disponibles(id_almacen);
      if (result.success) {
        setEmpleados(result.data);
      } else {
        notify({ type: "error", content: result.message });
      }
    } catch (error) {
      console.error(error);
      notify({
        type: "error",
        content: "Error al cargar empleados disponibles",
      });
    } finally {
      setLoadingEmpleados(false);
    }
  }, [id_almacen, notify]);

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  const empleadosOptions = useMemo(
    () =>
      empleados.map((e) => ({
        value: String(e.id_empleado),
        label: e.nombre_completo,
        description: e.dni || undefined,
      })),
    [empleados],
  );

  const handleAsignar = async (
    onSuccess?: (nuevo: RES_ResponsableAlmacen) => void,
  ) => {
    setFormError("");

    if (!empleadoSeleccionado || !fechaInicio) {
      setFormError("Seleccione responsable y fecha de inicio.");
      return;
    }

    const payload = {
      id_almacen,
      id_empleado: Number(empleadoSeleccionado),
      fecha_inicio: dayjs(fechaInicio).format("YYYY-MM-DD"),
    };

    const validation = Schema_NuevoResponsable.safeParse(payload);
    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message || "Datos inválidos.");
      return;
    }

    setLoading(true);
    try {
      const result = await AlmacenesService.nuevo_responsable(validation.data);
      if (result.success) {
        notify({
          type: "success",
          content: result.message || "Responsable asignado",
        });

        // Actualización local: quitar de los disponibles
        setEmpleados((prev) =>
          prev.filter((e) => e.id_empleado !== Number(empleadoSeleccionado)),
        );

        resetForm();
        if (onSuccess) onSuccess(result.data);
      } else {
        setFormError(result.message);
        notify({ type: "error", content: result.message });
      }
    } catch (error) {
      const msg = "Error al asignar el nuevo responsable";
      setFormError(msg);
      notify({ type: "error", content: msg });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const agregarDisponible = (emp: RES_Empleado) => {
    setEmpleados((prev) => {
      const existe = prev.some((e) => e.id_empleado === emp.id_empleado);
      if (existe) return prev;
      return [...prev, emp];
    });
  };

  const resetForm = () => {
    setEmpleadoSeleccionado(null);
    setFechaInicio(new Date());
    setFormError("");
  };

  return {
    loading: loading || loadingEmpleados,
    isAssigning: loading,
    empleadosOptions,
    empleadoSeleccionado,
    setEmpleadoSeleccionado,
    fechaInicio,
    setFechaInicio,
    formError,
    handleAsignar,
    agregarDisponible,
  };
};
