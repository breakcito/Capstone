import { api } from "../../../service/_api";
import type { IRespuesta } from "../../../shared/interfaces/_response";
import type { DTO_RegistroRol } from "./roles.requests";
import type {
  RES_Rol,
  RES_MenuEstructura,
  RES_PermisoNodo,
} from "./roles.responses";

export class RolesService {
  private static PATH = "/roles";

  public static get_roles = async (): Promise<IRespuesta<RES_Rol[]>> => {
    const { data } = await api.get(`${this.PATH}`);
    return data;
  };

  public static get_estructura_permisos = async (): Promise<
    IRespuesta<RES_MenuEstructura[]>
  > => {
    const { data } = await api.get(`${this.PATH}/estructura-permisos`);
    return data;
  };

  public static crear_rol = async (
    dto: DTO_RegistroRol,
  ): Promise<IRespuesta<RES_Rol>> => {
    const { data } = await api.post(`${this.PATH}`, dto);
    return data;
  };

  public static get_permisos_rol = async (
    id_rol: number,
  ): Promise<IRespuesta<RES_PermisoNodo[]>> => {
    const { data } = await api.get(`${this.PATH}/permisos/${id_rol}`);
    return data;
  };

  public static actualizar_permisos_rol = async (
    id_rol: number,
    permisos: RES_PermisoNodo[],
  ): Promise<IRespuesta<null>> => {
    const { data } = await api.patch(`${this.PATH}/permisos/${id_rol}`, {
      permisos,
    });
    return data;
  };
}
