import { api } from "./_api";

export class ArchivoService {
  private static PATH = "/download-archivo";
  private static PATH_EXTERNO = "/descargar-externo";

  /**
   * Realiza la petición al API para obtener el blob del archivo.
   */
  public static descargarArchivo = async (
    pathRelativo: string,
    nombre: string,
  ): Promise<Blob> => {
    const { data } = await api.get(`${this.PATH}`, {
      params: {
        path_relativo: pathRelativo,
        nombre: nombre,
      },
      responseType: "blob",
    });
    return data;
  };

  /**
   * Pasa por el proxy del backend para descargar una imagen externa
   * (CDN, S3, etc.) y obtener el blob con CORS abierto.
   * Evita que el navegador sufra preflight CORS al pedirla directamente.
   */
  public static descargarExterno = async (url: string): Promise<Blob> => {
    const { data } = await api.get(`${this.PATH_EXTERNO}`, {
      params: { url },
      responseType: "blob",
    });
    return data;
  };
}
