import { useState, useEffect, useMemo, useCallback } from "react";
import { CuentasService } from "../service/cuentas.service";
import { useDisclosure } from "@mantine/hooks";
import type { RES_Cuenta } from "../service/cuentas.responses";
import type { RES_Empleado } from "../../../service/responses/empleado";
import { useNotify } from "../../../hooks/useNotify";
import type { RES_Rol } from "../../../service/responses/rol";
import { AuxService } from "../../../service/auxiliar.service";

export const useCuentas = () => {
  const [cuentas, setCuentas] = useState<RES_Cuenta[]>([]);
  const [roles, setRoles] = useState<RES_Rol[]>([]);
  const [empleadosSinCuenta, setEmpleadosSinCuenta] = useState<RES_Empleado[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const { notify } = useNotify();
  const [updatingPhoto, setUpdatingPhoto] = useState<number | null>(null);

  // Modales
  const [openedCreate, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);

  const [selectedCuenta, setSelectedCuenta] = useState<RES_Cuenta | null>(null);

  const cargarCuentas = useCallback(async () => {
    setLoading(true);
    try {
      const resCuentas = await CuentasService.fetchCuentas();
      if (resCuentas.success) setCuentas(resCuentas.data);
    } catch (error) {
      console.error("Error cargando datos de cuentas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingEmpleados, setLoadingEmpleados] = useState(false);

  const cargarRoles = useCallback(async () => {
    setLoadingRoles(true);
    try {
      const res = await AuxService.get_roles_disponibles();
      if (res.success) setRoles(res.data);
    } catch (error) {
      console.error("Error cargando roles:", error);
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  const cargarEmpleadosSinCuenta = useCallback(async () => {
    setLoadingEmpleados(true);
    try {
      const res = await AuxService.get_empleados({ con_cuenta: false });
      if (res.success) setEmpleadosSinCuenta(res.data);
    } catch (error) {
      console.error("Error cargando empleados sin cuenta:", error);
    } finally {
      setLoadingEmpleados(false);
    }
  }, []);

  const cargarOpcionesFormulario = useCallback(() => {
    cargarRoles();
    cargarEmpleadosSinCuenta();
  }, [cargarRoles, cargarEmpleadosSinCuenta]);

  useEffect(() => {
    cargarCuentas();
  }, [cargarCuentas]);

  const cuentasFiltradas = useMemo(() => {
    return cuentas.filter(
      (c) =>
        c.username.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.nombre_empleado.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.apellido_empleado.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.nombre_rol.toLowerCase().includes(busqueda.toLowerCase()),
    );
  }, [cuentas, busqueda]);

  const handleOpenCreate = useCallback(() => {
    setSelectedCuenta(null);
    cargarOpcionesFormulario();
    openCreate();
  }, [cargarOpcionesFormulario, openCreate]);

  const handleOpenEdit = useCallback((cuenta: RES_Cuenta) => {
    setSelectedCuenta(cuenta);
    cargarOpcionesFormulario();
    openCreate();
  }, [cargarOpcionesFormulario, openCreate]);

  const handleUpdatePhoto = async (idEmpleado: number, file: File) => {
    setUpdatingPhoto(idEmpleado);
    try {
      const res = await CuentasService.actualizarFoto(idEmpleado, file);
      if (res.success) {
        notify({ type: "success", content: "Foto actualizada correctamente" });
        // Actualización local sin recargar todo el listado
        setCuentas((prev) =>
          prev.map((c) =>
            c.id_empleado === idEmpleado ? { ...c, url_foto: res.data } : c,
          ),
        );
      } else {
        notify({ type: "error", content: res.message });
      }
    } catch {
      notify({ type: "error", content: "Error al actualizar la foto" });
    } finally {
      setUpdatingPhoto(null);
    }
  };

  const pushNuevaCuenta = useCallback((nueva: RES_Cuenta) => {
    setCuentas((prev) => [nueva, ...prev]);
    setEmpleadosSinCuenta((prev) =>
      prev.filter((e) => e.id_empleado !== nueva.id_empleado),
    );
  }, []);

  return {
    cuentasFiltradas,
    roles,
    empleadosSinCuenta,
    loading,
    loadingRoles,
    loadingEmpleados,
    busqueda,
    setBusqueda,
    openedCreate,
    openCreate: handleOpenCreate,
    closeCreate,
    selectedCuenta,
    setSelectedCuenta,
    handleOpenEdit,
    handleUpdatePhoto,
    updatingPhoto,
    pushNuevaCuenta,
    refresh: cargarCuentas,
  };
};
