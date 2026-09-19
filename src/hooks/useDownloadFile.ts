import { useCallback, useState } from "react";
import { ArchivoService } from "../service/archivo.service";
import { useNotify } from "./useNotify";

export const useDownloadFile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { notifyError } = useNotify();

  const downloadFile = useCallback(
    async (pathRelativo: string, fileName: string) => {
      try {
        setIsLoading(true);
        // Obtenemos el blob del archivo desde el servicio (que usa axios y el interceptor de token)
        const blob = await ArchivoService.descargarArchivo(
          pathRelativo,
          fileName,
        );

        // Creamos una URL temporal para el blob
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);

        // Disparamos la descarga
        document.body.appendChild(link);
        link.click();

        // Limpieza necesaria
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error al descargar el archivo:", error);
        notifyError("Error al descargar el archivo");
      } finally {
        setIsLoading(false);
      }
    },
    [notifyError],
  );

  const viewFile = useCallback((url: string) => {
    window.open(url, "_blank");
  }, []);

  return { downloadFile, viewFile, isLoading };
};
