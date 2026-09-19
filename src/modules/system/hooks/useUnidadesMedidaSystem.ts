import { useCallback, useEffect, useState } from "react";
import { useNotify } from "../../../hooks/useNotify";
import { SystemService } from "../service/system.service";
import type { RES_UnidadMedida } from "../service/unidades-medida.responses";
import type { DTO_UnidadMedida } from "../service/unidades-medida.requests";

export const useUnidadesMedidaSystem = () => {
  const { notify } = useNotify();
  const [items, setItems] = useState<RES_UnidadMedida[]>([]);
  const [loading, setLoading] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const r = await SystemService.listar_unidades();
      if (r.success) setItems(r.data);
      else notify({ type: "error", content: r.message });
    } catch {
      notify({ type: "error", content: "Error al cargar unidades" });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { cargar(); }, [cargar]);

  const crear = async (dto: DTO_UnidadMedida) => {
    const r = await SystemService.crear_unidad(dto);
    if (r.success) cargar();
    return r;
  };
  const editar = async (id: number, dto: DTO_UnidadMedida) => {
    const r = await SystemService.editar_unidad(id, dto);
    if (r.success) cargar();
    return r;
  };
  const eliminar = async (id: number) => {
    const r = await SystemService.eliminar_unidad(id);
    if (r.success) cargar();
    return r;
  };

  return { items, loading, cargar, crear, editar, eliminar };
};
