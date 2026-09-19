import { useState, useEffect, useMemo, useCallback } from "react";
import { useNotify } from "../../../hooks/useNotify";
import { AlmacenesService } from "../service/almacenes.service";
import type {
  RES_AlmacenVecinoRel,
  RES_AlmacenDisponibleVecino,
} from "../service/almacenes.responses";

export const useAlmacenesVecinos = (id_almacen: number) => {
  const { notify } = useNotify();

  const [vecinos, setVecinos] = useState<RES_AlmacenVecinoRel[]>([]);
  const [disponibles, setDisponibles] = useState<RES_AlmacenDisponibleVecino[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDisponibles, setLoadingDisponibles] = useState(false);

  // Formulario
  const [idVecinoSeleccionado, setIdVecinoSeleccionado] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");
  const [formError, setFormError] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [loadingIdDesvinculando, setLoadingIdDesvinculando] = useState<number | null>(null);

  const listarVecinos = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const result = await AlmacenesService.get_vecinos(id_almacen);
      if (result.success) {
        setVecinos(result.data);
      } else {
        notify({ type: "error", content: result.message });
      }
    } catch (error) {
      notify({
        type: "error",
        content: "Error al cargar almacenes vecinos",
      });
      console.error(error);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [id_almacen, notify]);

  const listarDisponibles = useCallback(async (silent = false) => {
    if (!silent) setLoadingDisponibles(true);
    try {
      const result = await AlmacenesService.get_almacenes_disponibles_vecinos(id_almacen);
      if (result.success) {
        setDisponibles(result.data);
      } else {
        notify({ type: "error", content: result.message });
      }
    } catch (error) {
      notify({
        type: "error",
        content: "Error al cargar almacenes disponibles",
      });
      console.error(error);
    } finally {
      if (!silent) setLoadingDisponibles(false);
    }
  }, [id_almacen, notify]);

  useEffect(() => {
    listarVecinos(false);
    listarDisponibles(false);
  }, [listarVecinos, listarDisponibles]);

  const handleVincular = async () => {
    setFormError("");
    if (!idVecinoSeleccionado) {
      setFormError("Seleccione un almacén");
      return;
    }

    setIsLinking(true);
    try {
      const result = await AlmacenesService.agregar_vecino(
        id_almacen,
        parseInt(idVecinoSeleccionado)
      );
      if (result.success) {
        notify({
          type: "success",
          content: result.message || "Almacén vecino vinculado",
        });
        setIdVecinoSeleccionado("");
        setSearchValue("");
        listarVecinos(true);
        listarDisponibles(true);
      } else {
        notify({ type: "error", content: result.message });
      }
    } catch (error) {
      notify({ type: "error", content: "Error al vincular el almacén vecino" });
      console.error(error);
    } finally {
      setIsLinking(false);
    }
  };

  const handleDesvincular = async (id_almacen_vecino: number) => {
    setLoadingIdDesvinculando(id_almacen_vecino);
    try {
      const result = await AlmacenesService.eliminar_vecino(id_almacen_vecino);
      if (result.success) {
        notify({
          type: "success",
          content: result.message || "Vecino desvinculado",
        });
        listarVecinos(true);
        listarDisponibles(true);
      } else {
        notify({ type: "error", content: result.message });
      }
    } catch (error) {
      notify({ type: "error", content: "Error al desvincular el almacén vecino" });
      console.error(error);
    } finally {
      setLoadingIdDesvinculando(null);
    }
  };

  const selectOptions = useMemo(() => {
    return disponibles.map((d) => ({
      value: String(d.id_almacen),
      label: d.nombre,
    }));
  }, [disponibles]);

  return {
    vecinos,
    disponibles,
    loading,
    loadingDisponibles,
    selectOptions,
    idVecinoSeleccionado,
    setIdVecinoSeleccionado,
    searchValue,
    setSearchValue,
    formError,
    isLinking,
    loadingIdDesvinculando,
    handleVincular,
    handleDesvincular,
  };
};
