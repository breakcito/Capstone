import { useCallback, useEffect, useState } from "react";
import { useNotify } from "../../../hooks/useNotify";
import { SystemService } from "../service/system.service";
import type { RES_MenuArbol } from "../service/menu.responses";
import type { DTO_Nodo, DTO_Modulo } from "../service/menu.requests";

export const useMenuSystem = () => {
  const { notify } = useNotify();
  const [items, setItems] = useState<RES_MenuArbol[]>([]);
  const [loading, setLoading] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const r = await SystemService.get_menu_arbol();
      if (r.success) setItems(r.data);
      else notify({ type: "error", content: r.message });
    } catch {
      notify({ type: "error", content: "Error al cargar el árbol de navegación." });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { cargar(); }, [cargar]);

  const crearMenu = async (dto: DTO_Nodo) => {
    const r = await SystemService.crear_menu(dto);
    if (r.success) cargar();
    return r;
  };
  const editarMenu = async (id: number, dto: DTO_Nodo) => {
    const r = await SystemService.editar_menu(id, dto);
    if (r.success) cargar();
    return r;
  };
  const eliminarMenu = async (id: number) => {
    const r = await SystemService.eliminar_menu(id);
    if (r.success) cargar();
    return r;
  };
  const crearSubmenu = async (dto: DTO_Nodo & { id_menu: number }) => {
    const r = await SystemService.crear_submenu(dto);
    if (r.success) cargar();
    return r;
  };
  const editarSubmenu = async (id: number, dto: DTO_Nodo) => {
    const r = await SystemService.editar_submenu(id, dto);
    if (r.success) cargar();
    return r;
  };
  const eliminarSubmenu = async (id: number) => {
    const r = await SystemService.eliminar_submenu(id);
    if (r.success) cargar();
    return r;
  };
  const crearModulo = async (dto: DTO_Modulo) => {
    const r = await SystemService.crear_modulo(dto);
    if (r.success) cargar();
    return r;
  };
  const editarModulo = async (id: number, dto: DTO_Modulo) => {
    const r = await SystemService.editar_modulo(id, dto);
    if (r.success) cargar();
    return r;
  };
  const eliminarModulo = async (id: number) => {
    const r = await SystemService.eliminar_modulo(id);
    if (r.success) cargar();
    return r;
  };

  return {
    items, loading, cargar,
    crearMenu, editarMenu, eliminarMenu,
    crearSubmenu, editarSubmenu, eliminarSubmenu,
    crearModulo, editarModulo, eliminarModulo,
  };
};
