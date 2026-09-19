import { useState, useEffect, useMemo, useCallback } from "react";
import { useNotify } from "../../../hooks/useNotify";
import { AlmacenesService } from "../service/almacenes.service";
import type {
  RES_MinaAbastecida,
  RES_MinaDisponible,
} from "../service/almacenes.responses";

export const useAbastecerMina = (id_almacen: number) => {
  const { notify } = useNotify();

  // Estados de datos
  const [minasDisponibles, setMinasDisponibles] = useState<
    RES_MinaDisponible[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Formulario
  const [idMina, setIdMina] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");
  const [formError, setFormError] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const listarDisponibles = useCallback(async () => {
    setLoading(true);
    try {
      const result = await AlmacenesService.get_minas(id_almacen);
      if (result.success) {
        setMinasDisponibles(result.data);
      } else {
        notify({ type: "error", content: result.message });
      }
    } catch (error) {
      notify({
        type: "error",
        content: "Error al cargar las minas disponibles",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id_almacen, notify]);

  useEffect(() => {
    listarDisponibles();
  }, [listarDisponibles]);

  const handleAsignar = async (
    onSuccess?: (mina: RES_MinaAbastecida) => void,
  ) => {
    setFormError("");
    if (!idMina) {
      setFormError("Seleccione una mina");
      return;
    }

    const mina = minasDisponibles.find((m) => String(m.id_mina) === idMina);
    if (!mina) return;

    setIsAssigning(true);
    try {
      const result = await AlmacenesService.nueva_mina_por_abastecer(
        id_almacen,
        mina.id_mina,
      );
      if (result.success) {
        notify({
          type: "success",
          content: result.message || "Mina vinculada",
        });
        onSuccess?.(result.data);
        setMinasDisponibles((prev) =>
          prev.filter((m) => String(m.id_mina) !== idMina)
        );
        setIdMina("");
        setSearchValue("");
      } else {
        notify({ type: "error", content: result.message });
      }
    } catch (error) {
      notify({ type: "error", content: "Error al vincular la mina" });
      console.error(error);
    } finally {
      setIsAssigning(false);
    }
  };

  const selectOptions = useMemo(() => {
    const groups: Record<string, { value: string; label: string }[]> = {};
    minasDisponibles.forEach((m) => {
      const concesion = m.concesion || "Sin Concesión";
      if (!groups[concesion]) groups[concesion] = [];
      groups[concesion].push({ value: String(m.id_mina), label: m.nombre });
    });
    return Object.entries(groups).map(([concesion, items]) => ({
      group: concesion,
      items,
    }));
  }, [minasDisponibles]);

  return {
    minasDisponibles,
    loading,
    selectOptions,
    // Formulario
    idMina,
    setIdMina,
    searchValue,
    setSearchValue,
    formError,
    isAssigning,
    handleAsignar,
  };
};
