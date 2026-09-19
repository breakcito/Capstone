import { useState, useEffect, useCallback } from "react";
import { useNotify } from "../../../hooks/useNotify";
import { AlmacenesService } from "../service/almacenes.service";
import type { RES_MinaAbastecida } from "../service/almacenes.responses";

export const useMinasAbastecidas = (id_almacen: number) => {
  const { notify } = useNotify();
  const [minas, setMinas] = useState<RES_MinaAbastecida[]>([]);
  const [loading, setLoading] = useState(false);

  const listar = useCallback(async () => {
    setLoading(true);
    try {
      const result = await AlmacenesService.get_minas_abastecidas(id_almacen);
      if (result.success) {
        setMinas(result.data);
      } else {
        notify({ type: "error", content: result.message });
      }
    } catch (error) {
      notify({
        type: "error",
        content: "Error al cargar las minas abastecidas",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id_almacen, notify]);

  useEffect(() => {
    listar();
  }, [listar]);

  const handleDesvincular = async (
    id_almacen_mina: number,
    onMinasChange?: (delta: number) => void,
  ) => {
    if (!confirm("¿Está seguro de desvincular esta mina del almacén?")) return;

    try {
      const result =
        await AlmacenesService.eliminar_abastecimiento_mina(id_almacen_mina);
      if (result.success) {
        setMinas((prev) =>
          prev.filter((m) => m.id_almacen_mina !== id_almacen_mina),
        );
        notify({
          type: "success",
          content: result.message || "Mina desvinculada",
        });
        if (onMinasChange) onMinasChange(-1);
      } else {
        notify({ type: "error", content: result.message });
      }
    } catch (error) {
      notify({ type: "error", content: "Error al desvincular la mina" });
      console.error(error);
    }
  };

  const handleVinculada = (
    nueva: RES_MinaAbastecida,
    onMinasChange?: (delta: number) => void,
  ) => {
    setMinas((prev) => {
      const exists = prev.some(
        (m) => m.id_almacen_mina === nueva.id_almacen_mina,
      );
      if (exists) return prev;
      return [...prev, nueva].sort((a, b) => a.nombre.localeCompare(b.nombre));
    });
    if (onMinasChange) onMinasChange(1);
  };

  return {
    minas,
    loading,
    handleDesvincular,
    handleVinculada,
  };
};
