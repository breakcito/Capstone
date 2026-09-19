import { api } from "../../../service/_api";
import type { IRespuesta } from "../../../shared/interfaces/_response";
import type { DTO_Login } from "./login.requests";
import type { RES_Login } from "./login.responses";

export class LoginService {
  private static PATH = "/login";
  public static login = async (
    dto: DTO_Login,
  ): Promise<IRespuesta<RES_Login>> => {
    const { data } = await api.post(`${this.PATH}`, dto);
    return data;
  };
}
