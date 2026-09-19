import { api } from "../../../service/_api";
import type { IRespuesta } from "../../../shared/interfaces/_response";
import type {
  DTO_CrearProducto,
  DTO_ActualizarProducto,
} from "./productos.requests";
import type { RES_ProductoResumen } from "./productos.responses";

export class ProductosService {
  private static PATH = "/productos";

  public static get_productos = async (): Promise<
    IRespuesta<RES_ProductoResumen[]>
  > => {
    const { data } = await api.get(this.PATH);
    return data;
  };

  public static crear_producto = async (
    dto: DTO_CrearProducto,
  ): Promise<IRespuesta<RES_ProductoResumen>> => {
    const { data } = await api.post(this.PATH, dto);
    return data;
  };

  public static actualizar_producto = async (
    id_producto: number,
    dto: DTO_ActualizarProducto,
  ): Promise<IRespuesta<RES_ProductoResumen>> => {
    const { data } = await api.put(`${this.PATH}/${id_producto}`, dto);
    return data;
  };

  public static eliminar_producto = async (
    id_producto: number,
  ): Promise<IRespuesta<RES_ProductoResumen>> => {
    const { data } = await api.delete(`${this.PATH}/${id_producto}`);
    return data;
  };
}
