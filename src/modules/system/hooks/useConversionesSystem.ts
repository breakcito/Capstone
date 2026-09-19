import { useCallback, useEffect, useState } from "react";
import { useNotify } from "../../../hooks/useNotify";
import { SystemService } from "../service/system.service";
import type { RES_Conversion } from "../service/conversiones.responses";
import type { DTO_Conversion } from "../service/conversiones.requests";

export const useConversionesSystem = () => {
  const { notify } = useNotify();
  const [items, setItems] = useState<RES_Conversion[]>([]);
  const [loading, setLoading] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const r = await SystemService.listar_conversiones();
      if (r.success) setItems(r.data);
      else notify({ type: "error", content: r.message });
    } catch {
      notify({ type: "error", content: "Error al cargar conversiones" });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { cargar(); }, [cargar]);

  const crear = async (dto: DTO_Conversion) => {
    const r = await SystemService.crear_conversion(dto);
    if (r.success) cargar();
    return r;
  };
  const editar = async (id: number, dto: DTO_Conversion) => {
    const r = await SystemService.editar_conversion(id, dto);
    if (r.success) cargar();
    return r;
  };
  const eliminar = async (id: number) => {
    const r = await SystemService.eliminar_conversion(id);
    if (r.success) cargar();
    return r;
  };

  return { items, loading, cargar, crear, editar, eliminar };
};
