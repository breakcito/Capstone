import { useCallback, useState } from "react";
import { useNotify } from "../../../hooks/useNotify";
import { SystemService } from "../service/system.service";
import type { RES_Archivo } from "../service/archivos.responses";

export const useArchivosSystem = () => {
  const { notify } = useNotify();
  const [items, setItems] = useState<RES_Archivo[]>([]);
  const [loading, setLoading] = useState(false);

  const cargar = useCallback(async (carpeta: string) => {
    if (!carpeta) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const r = await SystemService.listar_archivos(carpeta);
      if (r.success) setItems(r.data);
      else {
        setItems([]);
        notify({ type: "error", content: r.message });
      }
    } catch {
      notify({ type: "error", content: "Error al listar archivos" });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  const descargar = async (carpeta: string, nombre: string) => {
    try {
      await SystemService.descargar_archivo(carpeta, nombre);
    } catch {
      notify({ type: "error", content: "Error al descargar" });
    }
  };

  const renombrar = async (carpeta: string, old: string, nuevo: string) => {
    const r = await SystemService.renombrar_archivo({ carpeta, old, new: nuevo });
    notify({ type: r.success ? "success" : "error", content: r.message });
    if (r.success) cargar(carpeta);
    return r;
  };

  const eliminar = async (carpeta: string, nombre: string) => {
    const r = await SystemService.eliminar_archivo(carpeta, nombre);
    notify({ type: r.success ? "success" : "error", content: r.message });
    if (r.success) cargar(carpeta);
    return r;
  };

  return { items, loading, cargar, descargar, renombrar, eliminar };
};
