import { api } from "./_api";
import type { IRespuesta } from "../shared/interfaces/_response";
import type { RES_Menu } from "./responses/menu-navegacion";

export class MenuNavService {
  private static PATH = "/menu-nav";
  public static get_menu_navegacion = async (): Promise<
    IRespuesta<RES_Menu[]>
  > => {
    const { data } = await api.get(`${this.PATH}`);
    return data;
  };
}
