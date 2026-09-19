import { useEffect, useState } from "react";
import { AuxService } from "../service/auxiliar.service";
import type {
  RES_Departamento,
  RES_Distrito,
  RES_Provincia,
} from "../service/responses/ubicacion";

/**
 * Carga la lista COMPLETA de departamentos, provincias y distritos del Perú
 * una sola vez al montar el componente.
 *
 * Esto evita reconsultar al backend cada vez que el usuario elige un
 * departamento o una provincia en un Select en cascada. El filtrado de las
 * listas que se muestran en pantalla lo hace el componente (useMemo).
 *
 * Tamaño aproximado esperado:
 *  - 25 departamentos
 *  - 196 provincias
 *  - 1874 distritos
 * Es seguro cargarlas todas a la vez.
 */
export const useUbicacionCompleta = () => {
  const [loading, setLoading] = useState(true);
  const [departamentos, setDepartamentos] = useState<RES_Departamento[]>([]);
  const [provincias, setProvincias] = useState<RES_Provincia[]>([]);
  const [distritos, setDistritos] = useState<RES_Distrito[]>([]);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      try {
        const [dptos, provs, dists] = await Promise.all([
          AuxService.get_departamentos(),
          AuxService.get_provincias(),
          AuxService.get_distritos(),
        ]);
        if (cancel) return;
        if (dptos.success) {
          setDepartamentos((dptos.data ?? []) as RES_Departamento[]);
        }
        if (provs.success) {
          setProvincias((provs.data ?? []) as RES_Provincia[]);
        }
        if (dists.success) {
          setDistritos((dists.data ?? []) as RES_Distrito[]);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  return {
    loading,
    departamentos,
    provincias,
    distritos,
  };
};