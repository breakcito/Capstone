import { useState, useEffect, useCallback } from "react";
import { useNotify } from "../../../hooks/useNotify";
import { RolesService } from "../service/roles.service";
import { Schema_RegistroRol } from "../service/roles.requests";
import type {
  RES_Rol,
  RES_MenuEstructura,
  RES_PermisoNodo,
  RES_Modulo,
} from "../service/roles.responses";

interface UseRegistroRolProps {
  onSuccess?: (nuevo: RES_Rol) => void;
  onUpdateSuccess?: () => void;
  onClose: () => void;
  rolEdicion?: RES_Rol | null;
}

export const useRegistroRol = ({
  onSuccess,
  onUpdateSuccess,
  onClose,
  rolEdicion,
}: UseRegistroRolProps) => {
  const { notify } = useNotify();

  const [estructura, setEstructura] = useState<RES_MenuEstructura[]>([]);
  const [loadingEstructura, setLoadingEstructura] = useState(false);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<
    RES_PermisoNodo[]
  >([]);

  const [loadingPermisos, setLoadingPermisos] = useState(false);
  const [saving, setSaving] = useState(false);

  const cargarEstructura = useCallback(async () => {
    setLoadingEstructura(true);
    try {
      const result = await RolesService.get_estructura_permisos();
      if (result.success) setEstructura(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEstructura(false);
    }
  }, []);

  useEffect(() => {
    cargarEstructura();
  }, [cargarEstructura]);

  const cargarPermisosRol = useCallback(async (id: number) => {
    setLoadingPermisos(true);
    try {
      const result = await RolesService.get_permisos_rol(id);
      if (result.success) setPermisosSeleccionados(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPermisos(false);
    }
  }, []);

  const reset = useCallback(() => {
    setNombre("");
    setDescripcion("");
    setPermisosSeleccionados([]);
  }, []);

  useEffect(() => {
    if (rolEdicion) {
      setNombre(rolEdicion.nombre);
      setDescripcion(rolEdicion.descripcion || "");
      cargarPermisosRol(rolEdicion.id);
    } else {
      reset();
    }
  }, [rolEdicion, cargarPermisosRol, reset]);

  const handleTogglePermiso = (
    tipo: "menu" | "submenu" | "modulo",
    id: number,
  ) => {
    setPermisosSeleccionados((prev) => {
      const exists = prev.some((p) => p.tipo === tipo && p.id === id);
      if (exists) return prev.filter((p) => !(p.tipo === tipo && p.id === id));
      return [...prev, { tipo, id } as RES_PermisoNodo];
    });
  };

  const handleToggleSubmenu = (
    modulos: RES_Modulo[],
    checked: boolean,
  ) => {
    setPermisosSeleccionados((prev) => {
      const ids = modulos.map((m) => m.id);
      const filtered = prev.filter(
        (p) => !(p.tipo === "modulo" && ids.includes(p.id)),
      );
      if (!checked) return filtered;
      const nuevas: RES_PermisoNodo[] = modulos
        .filter(
          (m) => !filtered.some((p) => p.tipo === "modulo" && p.id === m.id),
        )
        .map((m) => ({ tipo: "modulo", id: m.id }));
      return [...filtered, ...nuevas];
    });
  };

  const isChecked = (tipo: string, id: number) =>
    permisosSeleccionados.some((p) => p.tipo === tipo && p.id === id);

  const handleGuardar = async () => {
    const data = { nombre, descripcion, permisos: permisosSeleccionados };
    const validation = Schema_RegistroRol.safeParse(data);
    if (!validation.success) {
      notify({ type: "error", content: validation.error.issues[0].message });
      return;
    }

    setSaving(true);
    try {
      if (rolEdicion) {
        const result = await RolesService.actualizar_permisos_rol(
          rolEdicion.id,
          permisosSeleccionados,
        );
        if (result.success) {
          notify({
            type: "success",
            content: "Permisos actualizados correctamente",
          });
          onUpdateSuccess?.();
          onClose();
          reset();
        } else {
          notify({ type: "error", content: result.message });
        }
      } else {
        const result = await RolesService.crear_rol(validation.data);
        if (result.success) {
          notify({
            type: "success",
            content: "Rol registrado correctamente",
          });
          onSuccess?.(result.data);
          onClose();
          reset();
        } else {
          notify({ type: "error", content: result.message });
        }
      }
    } catch (err) {
      notify({
        type: "error",
        content: "Error inesperado al procesar el rol",
      });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return {
    estructura,
    loadingEstructura,
    loadingPermisos,
    nombre,
    setNombre,
    descripcion,
    setDescripcion,
    permisosSeleccionados,
    handleTogglePermiso,
    handleToggleSubmenu,
    isChecked,
    handleGuardar,
    saving,
    reset,
  };
};
