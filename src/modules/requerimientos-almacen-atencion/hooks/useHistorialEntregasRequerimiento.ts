import { useState, useEffect, useCallback } from "react";
import { AtencionService } from "../service/atencion.service";
import type {
  RES_DetalleEntregaRequerimiento,
  RES_EntregaRequerimiento,
} from "../../../service/responses/requerimientos-almacen/requerimiento-almacen-entrega";

export interface ExtendedRES_Entrega extends RES_EntregaRequerimiento {
  detalles: (RES_DetalleEntregaRequerimiento & { producto: string })[];
}

export const useHistorialEntregasRequerimiento = (idRequerimiento: number) => {
  const [loading, setLoading] = useState(true);
  const [historial, setHistorial] = useState<ExtendedRES_Entrega[]>([]);
  const [error, setError] = useState("");

  const obtenerHistorial = useCallback(async () => {
    if (!idRequerimiento) return;
    setLoading(true);
    setError("");
    try {
      const res =
        await AtencionService.obtenerHistorialEntregas(idRequerimiento);
      if (res.success) {
        setHistorial(res.data as unknown as ExtendedRES_Entrega[]);
      } else {
        setError(res.message || "Error al obtener historial");
      }
    } catch (err) {
      console.error(err);
      setError("Error al obtener historial");
    } finally {
      setLoading(false);
    }
  }, [idRequerimiento]);

  useEffect(() => {
    obtenerHistorial();
  }, [obtenerHistorial]);

  return { loading, historial, error };
};
