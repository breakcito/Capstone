import { useState, useEffect, useCallback, useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useNotify } from "../../../hooks/useNotify";
import { RolesService } from "../service/roles.service";
import type { RES_Rol } from "../service/roles.responses";

export const useRoles = () => {
  const { notify } = useNotify();

  const [roles, setRoles] = useState<RES_Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [openedCreate, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);

  const [selectedRol, setSelectedRol] = useState<RES_Rol | null>(null);

  const handleOpenEdit = (rol: RES_Rol) => {
    setSelectedRol(rol);
    openCreate();
  };

  const handleCloseModal = () => {
    setSelectedRol(null);
    closeCreate();
  };

  const listar = useCallback(async () => {
    setLoading(true);
    try {
      const result = await RolesService.get_roles();
      if (result.success) {
        setRoles(result.data);
      } else {
        notify({ type: "error", content: result.message });
      }
    } catch (error) {
      notify({ type: "error", content: "Error al cargar los roles" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    listar();
  }, [listar]);

  const rolesFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return roles.filter(
      (r) =>
        !q ||
        r.nombre.toLowerCase().includes(q) ||
        r.descripcion?.toLowerCase().includes(q),
    );
  }, [roles, busqueda]);

  const onRolCreado = (nuevo: RES_Rol) => {
    setRoles((prev) => [nuevo, ...prev]);
  };

  return {
    rolesFiltrados,
    loading,
    busqueda,
    setBusqueda,
    openedCreate,
    openCreate,
    closeCreate: handleCloseModal,
    selectedRol,
    handleOpenEdit,
    onRolCreado,
    recargar: listar,
  };
};
