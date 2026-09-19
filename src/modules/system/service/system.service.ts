import { api } from "../../../service/_api";
import type { IRespuesta } from "../../../shared/interfaces/_response";
import type { DTO_UnidadMedida } from "./unidades-medida.requests";
import type { RES_UnidadMedida } from "./unidades-medida.responses";
import type { DTO_Conversion } from "./conversiones.requests";
import type { RES_Conversion } from "./conversiones.responses";
import type { DTO_Nodo, DTO_Modulo } from "./menu.requests";
import type { RES_MenuArbol, RES_Nodo } from "./menu.responses";
import type { DTO_RenameArchivo } from "./archivos.requests";
import type { RES_Archivo } from "./archivos.responses";

const downloadBlob = (blob: Blob, nombre: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export class SystemService {
  private static PATH = "/system";

  static listar_unidades = async (): Promise<IRespuesta<RES_UnidadMedida[]>> => {
    const { data } = await api.get(`${this.PATH}/unidades-medida`);
    return data;
  };

  static crear_unidad = async (dto: DTO_UnidadMedida): Promise<IRespuesta<RES_UnidadMedida>> => {
    const { data } = await api.post(`${this.PATH}/unidades-medida`, dto);
    return data;
  };

  static editar_unidad = async (id: number, dto: DTO_UnidadMedida): Promise<IRespuesta<RES_UnidadMedida>> => {
    const { data } = await api.put(`${this.PATH}/unidades-medida/${id}`, dto);
    return data;
  };

  static eliminar_unidad = async (id: number): Promise<IRespuesta<null>> => {
    const { data } = await api.delete(`${this.PATH}/unidades-medida/${id}`);
    return data;
  };

  static listar_conversiones = async (): Promise<IRespuesta<RES_Conversion[]>> => {
    const { data } = await api.get(`${this.PATH}/conversiones`);
    return data;
  };

  static crear_conversion = async (dto: DTO_Conversion): Promise<IRespuesta<RES_Conversion>> => {
    const { data } = await api.post(`${this.PATH}/conversiones`, dto);
    return data;
  };

  static editar_conversion = async (id: number, dto: DTO_Conversion): Promise<IRespuesta<RES_Conversion>> => {
    const { data } = await api.put(`${this.PATH}/conversiones/${id}`, dto);
    return data;
  };

  static eliminar_conversion = async (id: number): Promise<IRespuesta<null>> => {
    const { data } = await api.delete(`${this.PATH}/conversiones/${id}`);
    return data;
  };

  static get_menu_arbol = async (): Promise<IRespuesta<RES_MenuArbol[]>> => {
    const { data } = await api.get(`${this.PATH}/menu-arbol`);
    return data;
  };

  static crear_menu = async (dto: DTO_Nodo): Promise<IRespuesta<RES_Nodo>> => {
    const { data } = await api.post(`${this.PATH}/menu`, dto);
    return data;
  };
  static editar_menu = async (id: number, dto: DTO_Nodo): Promise<IRespuesta<null>> => {
    const { data } = await api.put(`${this.PATH}/menu/${id}`, dto);
    return data;
  };
  static eliminar_menu = async (id: number): Promise<IRespuesta<null>> => {
    const { data } = await api.delete(`${this.PATH}/menu/${id}`);
    return data;
  };

  static crear_submenu = async (
    dto: DTO_Nodo & { id_menu: number },
  ): Promise<IRespuesta<RES_Nodo>> => {
    const { data } = await api.post(`${this.PATH}/submenu`, dto);
    return data;
  };
  static editar_submenu = async (id: number, dto: DTO_Nodo): Promise<IRespuesta<null>> => {
    const { data } = await api.put(`${this.PATH}/submenu/${id}`, dto);
    return data;
  };
  static eliminar_submenu = async (id: number): Promise<IRespuesta<null>> => {
    const { data } = await api.delete(`${this.PATH}/submenu/${id}`);
    return data;
  };

  static crear_modulo = async (dto: DTO_Modulo): Promise<IRespuesta<RES_Nodo>> => {
    const { data } = await api.post(`${this.PATH}/modulo`, dto);
    return data;
  };
  static editar_modulo = async (id: number, dto: DTO_Modulo): Promise<IRespuesta<null>> => {
    const { data } = await api.put(`${this.PATH}/modulo/${id}`, dto);
    return data;
  };
  static eliminar_modulo = async (id: number): Promise<IRespuesta<null>> => {
    const { data } = await api.delete(`${this.PATH}/modulo/${id}`);
    return data;
  };

  static listar_archivos = async (carpeta: string): Promise<IRespuesta<RES_Archivo[]>> => {
    const { data } = await api.get(`${this.PATH}/archivos`, { params: { carpeta } });
    return data;
  };

  static descargar_archivo = async (carpeta: string, nombre: string): Promise<void> => {
    const response = await api.get(`${this.PATH}/archivos/descargar`, {
      params: { carpeta, nombre },
      responseType: "blob",
    });
    downloadBlob(response.data, nombre);
  };

  static renombrar_archivo = async (dto: DTO_RenameArchivo): Promise<IRespuesta<null>> => {
    const { data } = await api.put(`${this.PATH}/archivos/renombrar`, dto);
    return data;
  };

  static eliminar_archivo = async (carpeta: string, nombre: string): Promise<IRespuesta<null>> => {
    const { data } = await api.delete(`${this.PATH}/archivos`, {
      data: { carpeta, nombre },
    });
    return data;
  };
}
