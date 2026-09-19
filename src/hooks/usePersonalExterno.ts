import { useState, useEffect, useCallback } from "react";
import { AuxService } from "../service/auxiliar.service";
import { useNotify } from "./useNotify";
import type { RES_PersonalExterno } from "../service/responses/personal-externo";
import type { EstadoBase } from "../shared/enums/_generic/estado-base";

export interface UsePersonalExternoProps {
  idProveedor?: number;
  estado?: EstadoBase;
  autoFetch?: boolean;
  onRegisterSuccess?: (nuevo: RES_PersonalExterno) => void;
}

export const usePersonalExterno = ({
  idProveedor,
  estado,
  autoFetch = true,
  onRegisterSuccess,
}: UsePersonalExternoProps = {}) => {
  const [personal, setPersonal] = useState<RES_PersonalExterno[]>([]);
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notifySuccess, notifyError } = useNotify();

  const fetchPersonal = useCallback(
    async (filters?: {
      id_personal?: number;
      id_proveedor?: number;
      estado?: EstadoBase;
    }) => {
      setLoading(true);
      try {
        const activeFilters =
          filters !== undefined
            ? filters
            : { id_proveedor: idProveedor, estado };
        const res = await AuxService.get_personal_externo(activeFilters);
        if (res.success && res.data) {
          setPersonal(res.data);
          return res.data;
        }
        return [];
      } catch (err) {
        console.error(err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [idProveedor, estado],
  );

  const handleCrearPersonal = useCallback(
    async (customProveedorId?: number) => {
      const trimmedNombre = nombre.trim();
      if (!trimmedNombre) return false;

      setIsSubmitting(true);
      try {
        const activeProveedorId =
          typeof customProveedorId === "number"
            ? customProveedorId
            : typeof customProveedorId === "string" &&
                !isNaN(Number(customProveedorId))
              ? Number(customProveedorId)
              : idProveedor;

        const res = await AuxService.crear_personal_externo({
          id_proveedor: activeProveedorId,
          nombre: trimmedNombre,
          apellido: apellido.trim() || undefined,
          dni: dni.trim() || undefined,
        });

        if (res.success && res.data) {
          notifySuccess("Personal registrado correctamente");
          const nuevo = res.data;

          // Agregar automáticamente a la lista local
          setPersonal((prev) => [...prev, nuevo]);

          if (onRegisterSuccess) {
            onRegisterSuccess(nuevo);
          }
          // Limpiar campos del formulario
          setNombre("");
          setApellido("");
          setDni("");
          return nuevo;
        }
        return false;
      } catch (err) {
        console.error(err);
        notifyError("Error al registrar personal externo");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      nombre,
      apellido,
      dni,
      idProveedor,
      notifySuccess,
      notifyError,
      onRegisterSuccess,
    ],
  );

  useEffect(() => {
    if (autoFetch) {
      fetchPersonal();
    }
  }, [autoFetch, fetchPersonal]);

  return {
    personal,
    loading,
    fetchPersonal,
    nombre,
    setNombre,
    apellido,
    setApellido,
    dni,
    setDni,
    isSubmitting,
    handleCrearPersonal,
    setPersonal,
  };
};
