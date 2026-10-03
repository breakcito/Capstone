import { useState, useEffect, useCallback } from "react";
import { isAxiosError } from "axios";
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
  // Inicializar a array vacio, nunca null, para que el .map() no falle
  // si el backend devuelve `data: null` por error.
  const [historial, setHistorial] = useState<ExtendedRES_Entrega[]>([]);
  const [error, setError] = useState("");

  const obtenerHistorial = useCallback(async () => {
    if (!idRequerimiento) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");

    // El backend SIEMPRE responde 200 con {success, data, message}. Asi que
    // si el body viene con data = [] (array vacio), siempre es "no hay
    // entregas", NO un error. Solo mostramos el mensaje de error
    // cuando ni siquiera tenemos response del backend (red caida, 500,
    // timeout, etc.) o cuando la API responde con success: false Y un
    // mensaje util que indique error real.
    const esErrorDeRed = (err: unknown): boolean => {
      if (isAxiosError(err)) {
        return !err.response;
      }
      return true;
    };

    try {
      const res =
        await AtencionService.obtenerHistorialEntregas(idRequerimiento);
      // Caso 1: success = true, data = array (incluso vacio) => OK
      if (res.success) {
        const data = Array.isArray(res.data)
          ? (res.data as unknown as ExtendedRES_Entrega[])
          : [];
        setHistorial(data);
        return;
      }
      // Caso 2: success = false PERO data es array => probablemente "no hay",
      // no un error real. No mostramos nada y dejamos que el empty state
      // del componente tome el control.
      if (Array.isArray(res.data)) {
        setHistorial(res.data as unknown as ExtendedRES_Entrega[]);
        return;
      }
      // Caso 3: success = false sin data de array => mostrar mensaje.
      setError(res.message || "No se encontraron entregas registradas");
    } catch (err) {
      // Si axios recibio un 4xx/5xx pero el body tiene success=true
      // (caso raro pero posible: por ejemplo, CORS o proxy raro),
      // igual tomamos el data como valido.
      if (isAxiosError(err) && err.response?.data) {
        const data = err.response.data;
        if (data.success === true && Array.isArray(data.data)) {
          setHistorial(data.data as unknown as ExtendedRES_Entrega[]);
          return;
        }
        if (Array.isArray(data.data)) {
          setHistorial(data.data as unknown as ExtendedRES_Entrega[]);
          return;
        }
        if (data.message) {
          setError(data.message);
          return;
        }
      }

      console.error(err);
      if (esErrorDeRed(err)) {
        setError(
          "Sin conexion con el servidor. Verifique su red e intente nuevamente.",
        );
      } else {
        setError("No se pudieron cargar las entregas. Intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  }, [idRequerimiento]);

  useEffect(() => {
    obtenerHistorial();
  }, [obtenerHistorial]);

  return { loading, historial, error };
};
