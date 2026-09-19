import { useState, useEffect, useMemo, useCallback } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useNotify } from "../../../hooks/useNotify";
import type { IMessage } from "../../../stores/ui.store";
import type { RES_AlmacenResumen } from "../service/almacenes.responses";
import { AlmacenesService } from "../service/almacenes.service";
import { Schema_CrearAlmacen } from "../service/almacenes.requests";

/**
 * Hook del modulo Almacenes.
 *
 * Se parametriza por `paraCarbon`:
 * - paraCarbon=false (logistica): lista almacenes de logistica, expone los
 *   modales de Responsables / Vecinos / Minas a abastecer.
 * - paraCarbon=true (carbon): lista almacenes de carbon. Esos almacenes
 *   NO requieren responsables, ni almacenes vecinos, ni minas a abastecer,
 *   asi que esos modales quedan ocultos en la vista.
 */
export const useAlmacenes = (paraCarbon: boolean = false) => {
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
  const [openedAlcance, { open: openAlcance, close: closeAlcance }] =
    useDisclosure(false);
  const [openedVecinos, { open: openVecinos, close: closeVecinos }] =
    useDisclosure(false);
  const [selectedAlmacen, setSelectedAlmacen] = useState<RES_AlmacenResumen | null>(
    null,
  );

  // Formulario de Registro
  const [formNombre, setFormNombre] = useState("");
  const [formDescripcion, setFormDescripcion] = useState("");
  const [formEsPrincipal, setFormEsPrincipal] = useState(false);
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
    setFormDescripcion("");
    setFormEsPrincipal(false);
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
      const result = await AlmacenesService.get_almacenes({ para_carbon: paraCarbon });
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
  }, [notify, paraCarbon]);

  useEffect(() => {
    listar();
  }, [listar]);

  const handleCrearAlmacen = async () => {
    setFormError("");
    const data = {
      nombre: formNombre,
      descripcion: formDescripcion,
      es_principal: formEsPrincipal,
      para_carbon: paraCarbon,
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
    openedAlcance,
    openAlcance,
    closeAlcance,
    openedVecinos,
    openVecinos,
    closeVecinos,
    selectedAlmacen,
    setSelectedAlmacen,

    // Registro
    formNombre,
    setFormNombre,
    formDescripcion,
    setFormDescripcion,
    formEsPrincipal,
    setFormEsPrincipal,
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

    // Modo
    paraCarbon,
  };
};