import { useState, useEffect, useMemo, useCallback } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useNotify } from "../../../hooks/useNotify";
import type { IMessage } from "../../../stores/ui.store";
import type { RES_AlmacenResumen } from "../service/almacenes.responses";
import { AlmacenesService } from "../service/almacenes.service";
import { Schema_CrearAlmacen } from "../service/almacenes.requests";

export const useAlmacenes = () => {
  const { notify } = useNotify();

  // Estados de la lista
  const [almacenes, setAlmacenes] = useState<RES_AlmacenResumen[]>([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Modales y selección
  const [openedCreate, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);
  const [
    openedResponsables,
    { open: openResponsables, close: closeResponsables },
  ] = useDisclosure(false);
  const [selectedAlmacen, setSelectedAlmacen] = useState<RES_AlmacenResumen | null>(
    null,
  );

  // Formulario de Registro
  const [formNombre, setFormNombre] = useState("");
  const [formIdEmpleadoResponsable, setFormIdEmpleadoResponsable] = useState<number | null>(null);
  const [formDireccion, setFormDireccion] = useState("");
  const [formIdDepartamento, setFormIdDepartamento] = useState<number | null>(
    null,
  );
  const [formIdProvincia, setFormIdProvincia] = useState<number | null>(null);
  const [formIdDistrito, setFormIdDistrito] = useState<number | null>(null);
  const [formError, setFormError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const resetForm = useCallback(() => {
    setFormNombre("");
    setFormIdEmpleadoResponsable(null);
    setFormDireccion("");
    setFormIdDepartamento(null);
    setFormIdProvincia(null);
    setFormIdDistrito(null);
    setFormError("");
  }, []);

  const handleChildMessage = (msg: IMessage) => {
    if (!msg.type) return;
    notify(msg);
  };

  const listar = useCallback(async () => {
    setLoading(true);
    try {
      const result = await AlmacenesService.get_almacenes();
      if (result.success) {
        setAlmacenes(result.data);
      } else {
        notify({ type: "error", content: result.message });
      }
    } catch (error) {
      notify({ type: "error", content: "Error al cargar los almacenes" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    listar();
  }, [listar]);

  const handleCrearAlmacen = async () => {
    setFormError("");
    const data = {
      nombre: formNombre,
      id_empleado_responsable: formIdEmpleadoResponsable,
      direccion: formDireccion,
      id_departamento: formIdDepartamento,
      id_provincia: formIdProvincia,
      id_distrito: formIdDistrito,
    };

    const validation = Schema_CrearAlmacen.safeParse(data);
    if (!validation.success) {
      setFormError(validation.error.issues[0].message);
      return;
    }

    setIsRegistering(true);
    try {
      const result = await AlmacenesService.crear_almacen(validation.data);
      if (result.success) {
        setAlmacenes((prev) => [result.data, ...prev]);
        notify({ type: "success", content: "Almacén creado correctamente" });
        closeCreate();
        resetForm();
      } else {
        setFormError(result.message);
      }
    } catch (error) {
      setFormError("Error inesperado al crear el almacén");
      console.error(error);
    } finally {
      setIsRegistering(false);
    }
  };

  const almacenesFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return almacenes.filter(
      (alm) =>
        !q ||
        alm.nombre.toLowerCase().includes(q) ||
        (alm.responsables || "").toLowerCase().includes(q),
    );
  }, [almacenes, busqueda]);

  return {
    // Lista
    almacenes,
    loading,
    setAlmacenes,
    busqueda,
    setBusqueda,
    recargar: listar,
    almacenesFiltrados,
    handleChildMessage,

    // Modales y Selección
    openedCreate,
    openCreate,
    closeCreate,
    openedResponsables,
    openResponsables,
    closeResponsables,
    selectedAlmacen,
    setSelectedAlmacen,

    // Registro
    formNombre,
    setFormNombre,
    formIdEmpleadoResponsable,
    setFormIdEmpleadoResponsable,
    formDireccion,
    setFormDireccion,
    formIdDepartamento,
    setFormIdDepartamento,
    formIdProvincia,
    setFormIdProvincia,
    formIdDistrito,
    setFormIdDistrito,
    formError,
    isRegistering,
    handleCrearAlmacen,
    resetForm,
  };
};