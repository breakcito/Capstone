import { useState, useEffect, useMemo, useCallback } from "react";
import { CuentasService } from "../service/cuentas.service";
import type { RES_EmpleadoUsuario } from "../service/cuentas.responses";
import type { RES_Rol } from "../../../service/responses/rol";
import { AuxService } from "../../../service/auxiliar.service";
import { useNotify } from "../../../hooks/useNotify";

export type FiltroCuenta = "todos" | "con_cuenta" | "sin_cuenta";

export const useCuentas = () => {
  const [empleados, setEmpleados] = useState<RES_EmpleadoUsuario[]>([]);
  const [roles, setRoles] = useState<RES_Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCuenta, setFiltroCuenta] = useState<FiltroCuenta>("todos");
  const [updatingPhoto, setUpdatingPhoto] = useState<number | null>(null);

  // Modal Crear Cuenta
  const [empleadoParaCuenta, setEmpleadoParaCuenta] =
    useState<RES_EmpleadoUsuario | null>(null);
  const [loadingCrearCuenta, setLoadingCrearCuenta] = useState(false);

  // Modal Editar Cuenta / Cambiar Contraseña
  const [empleadoParaEditar, setEmpleadoParaEditar] =
    useState<RES_EmpleadoUsuario | null>(null);
  const [loadingEditarCuenta, setLoadingEditarCuenta] = useState(false);

  // Modal Nuevo Empleado
  const [openedCrearEmpleado, setOpenedCrearEmpleado] = useState(false);
  const [loadingCrearEmpleado, setLoadingCrearEmpleado] = useState(false);

  const { notifySuccess, notifyError, notifyInfo } = useNotify();

  // Cargar Empleados
  const cargarEmpleados = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await CuentasService.fetchEmpleados();
      if (res.success && res.data) {
        setEmpleados(res.data);
      }
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Cargar Roles (solo Almacenero y Administrador)
  const cargarRoles = useCallback(async () => {
    setLoadingRoles(true);
    try {
      const res = await AuxService.get_roles_disponibles();
      if (res.success && res.data) {
        setRoles(res.data);
      }
    } catch (error) {
      console.error("Error al cargar roles:", error);
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  useEffect(() => {
    cargarEmpleados();
    cargarRoles();
  }, [cargarEmpleados, cargarRoles]);

  // Actualizar Foto de Empleado
  const handleUpdatePhoto = async (idEmpleado: number, file: File) => {
    setUpdatingPhoto(idEmpleado);
    try {
      const res = await CuentasService.actualizarFoto(idEmpleado, file);
      if (res.success) {
        notifySuccess("Foto actualizada correctamente");
        setEmpleados((prev) =>
          prev.map((e) =>
            e.id_empleado === idEmpleado ? { ...e, url_foto: res.data } : e,
          ),
        );
      } else {
        notifyError(res.message || "Error al actualizar la foto");
      }
    } catch {
      notifyError("Error al subir la imagen");
    } finally {
      setUpdatingPhoto(null);
    }
  };

  // Crear Cuenta para un Empleado
  const abrirCrearCuenta = (emp: RES_EmpleadoUsuario) => {
    setEmpleadoParaCuenta(emp);
  };

  const cerrarCrearCuenta = () => {
    setEmpleadoParaCuenta(null);
    setLoadingCrearCuenta(false);
  };

  const handleCrearCuenta = async (payload: {
    id_rol: number;
    username: string;
    password: string;
  }) => {
    if (!empleadoParaCuenta) return;
    if (!payload.username.trim()) {
      notifyInfo("El nombre de usuario es obligatorio");
      return;
    }
    if (!payload.id_rol) {
      notifyInfo("Debe seleccionar un rol");
      return;
    }
    if (!payload.password || payload.password.length < 6) {
      notifyInfo("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoadingCrearCuenta(true);
    try {
      const res = await CuentasService.crearCuenta({
        id_empleado: empleadoParaCuenta.id_empleado,
        id_rol: payload.id_rol,
        username: payload.username.trim(),
        password: payload.password,
      });

      if (res.success) {
        notifySuccess(res.message || "Cuenta registrada exitosamente");
        const rolSeleccionado = roles.find((r) => r.id_rol === payload.id_rol);
        // Actualización local sin recargar la pantalla
        setEmpleados((prev) =>
          prev.map((e) =>
            e.id_empleado === empleadoParaCuenta.id_empleado
              ? {
                  ...e,
                  id_usuario: res.data?.id_usuario ?? 1,
                  username: payload.username.trim(),
                  id_rol: payload.id_rol,
                  nombre_rol: rolSeleccionado?.nombre || "Usuario",
                  estado_usuario: "Activo",
                }
              : e,
          ),
        );
        cerrarCrearCuenta();
      } else {
        notifyError(res.message || "No se pudo crear la cuenta");
      }
    } catch {
      notifyError("Error al registrar cuenta");
    } finally {
      setLoadingCrearCuenta(false);
    }
  };

  // Editar Cuenta / Cambiar Contraseña
  const abrirEditarCuenta = (emp: RES_EmpleadoUsuario) => {
    setEmpleadoParaEditar(emp);
  };

  const cerrarEditarCuenta = () => {
    setEmpleadoParaEditar(null);
    setLoadingEditarCuenta(false);
  };

  const handleEditarCuenta = async (payload: {
    id_rol: number;
    username: string;
    password?: string;
  }) => {
    if (!empleadoParaEditar || !empleadoParaEditar.id_usuario) return;
    if (!payload.username.trim()) {
      notifyInfo("El nombre de usuario es obligatorio");
      return;
    }
    if (!payload.id_rol) {
      notifyInfo("Debe seleccionar un rol");
      return;
    }
    if (payload.password && payload.password.length < 6) {
      notifyInfo("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoadingEditarCuenta(true);
    try {
      const res = await CuentasService.actualizarCuenta(
        empleadoParaEditar.id_usuario,
        {
          id_rol: payload.id_rol,
          username: payload.username.trim(),
          password: payload.password?.trim() || undefined,
        },
      );

      if (res.success) {
        notifySuccess(res.message || "Cuenta actualizada exitosamente");
        const rolSeleccionado = roles.find((r) => r.id_rol === payload.id_rol);
        // Actualización local sin recargar la pantalla
        setEmpleados((prev) =>
          prev.map((e) =>
            e.id_empleado === empleadoParaEditar.id_empleado
              ? {
                  ...e,
                  username: payload.username.trim(),
                  id_rol: payload.id_rol,
                  nombre_rol: rolSeleccionado?.nombre || e.nombre_rol,
                }
              : e,
          ),
        );
        cerrarEditarCuenta();
      } else {
        notifyError(res.message || "No se pudo actualizar la cuenta");
      }
    } catch {
      notifyError("Error al actualizar la cuenta");
    } finally {
      setLoadingEditarCuenta(false);
    }
  };

  // Registrar Nuevo Empleado
  const abrirCrearEmpleado = () => setOpenedCrearEmpleado(true);
  const cerrarCrearEmpleado = () => {
    setOpenedCrearEmpleado(false);
    setLoadingCrearEmpleado(false);
  };

  const handleCrearEmpleado = async (payload: {
    nombre: string;
    apellido: string;
    dni?: string;
    es_contratista?: boolean;
  }) => {
    if (!payload.nombre.trim() || !payload.apellido.trim()) {
      notifyInfo("Nombre y apellido son requeridos");
      return;
    }

    setLoadingCrearEmpleado(true);
    try {
      const res = await CuentasService.crearEmpleado({
        nombre: payload.nombre.trim(),
        apellido: payload.apellido.trim(),
        dni: payload.dni?.trim() || null,
        es_contratista: !!payload.es_contratista,
      });

      if (res.success && res.data) {
        notifySuccess("Empleado registrado exitosamente");
        const nuevoEmp: RES_EmpleadoUsuario = {
          id_empleado: res.data.id_empleado,
          nombre: res.data.nombre,
          apellido: res.data.apellido,
          nombre_completo: `${res.data.nombre} ${res.data.apellido}`,
          dni: res.data.dni || null,
          url_foto: res.data.url_foto || null,
          es_contratista: !!res.data.es_contratista,
          estado: "Activo",
          id_usuario: null,
          username: null,
          id_rol: null,
          nombre_rol: null,
          estado_usuario: null,
        };
        setEmpleados((prev) => [nuevoEmp, ...prev]);
        cerrarCrearEmpleado();
      } else {
        notifyError(res.message || "Error al crear empleado");
      }
    } catch {
      notifyError("Error al registrar empleado");
    } finally {
      setLoadingCrearEmpleado(false);
    }
  };

  // Filtros y Búsqueda
  const empleadosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();

    return empleados.filter((emp) => {
      // Filtro por estado de cuenta
      if (filtroCuenta === "con_cuenta" && !emp.id_usuario) return false;
      if (filtroCuenta === "sin_cuenta" && emp.id_usuario) return false;

      // Filtro por texto
      if (!q) return true;

      const matchNombre = emp.nombre.toLowerCase().includes(q);
      const matchApellido = emp.apellido.toLowerCase().includes(q);
      const matchDni = emp.dni ? emp.dni.toLowerCase().includes(q) : false;
      const matchUsername = emp.username
        ? emp.username.toLowerCase().includes(q)
        : false;
      const matchRol = emp.nombre_rol
        ? emp.nombre_rol.toLowerCase().includes(q)
        : false;

      return (
        matchNombre || matchApellido || matchDni || matchUsername || matchRol
      );
    });
  }, [empleados, busqueda, filtroCuenta]);

  const totalEmpleados = empleados.length;
  const totalConCuenta = useMemo(
    () => empleados.filter((e) => !!e.id_usuario).length,
    [empleados],
  );
  const totalSinCuenta = useMemo(
    () => empleados.filter((e) => !e.id_usuario).length,
    [empleados],
  );

  return {
    empleados: empleadosFiltrados,
    todosLosEmpleados: empleados,
    roles,
    loading,
    loadingRoles,
    busqueda,
    setBusqueda,
    filtroCuenta,
    setFiltroCuenta,
    totalEmpleados,
    totalConCuenta,
    totalSinCuenta,
    updatingPhoto,
    handleUpdatePhoto,
    // Crear cuenta
    empleadoParaCuenta,
    abrirCrearCuenta,
    cerrarCrearCuenta,
    handleCrearCuenta,
    loadingCrearCuenta,
    // Editar cuenta
    empleadoParaEditar,
    abrirEditarCuenta,
    cerrarEditarCuenta,
    handleEditarCuenta,
    loadingEditarCuenta,
    // Crear empleado
    openedCrearEmpleado,
    abrirCrearEmpleado,
    cerrarCrearEmpleado,
    handleCrearEmpleado,
    loadingCrearEmpleado,
    // Refresco
    refresh: () => cargarEmpleados(false),
    refreshSilencioso: () => cargarEmpleados(true),
  };
};
