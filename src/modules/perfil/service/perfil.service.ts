import { api } from "../../../service/_api";
import type { IRespuesta } from "../../../shared/interfaces/_response";
import type { RES_Perfil } from "./perfil.responses";

export class PerfilService {
  private static PATH = "/perfil";

  public static get_perfil = async (): Promise<IRespuesta<RES_Perfil>> => {
    const { data } = await api.get(`${this.PATH}`);
    return data;
  };
}
