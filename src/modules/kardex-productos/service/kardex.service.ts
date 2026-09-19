import { api } from "../../../service/_api";
import type { IRespuesta } from "../../../shared/interfaces/_response";
import type { RES_MovimientoKardex } from "./kardex.responses";

export class KardexService {
  private static readonly PATH = "/kardex-productos";

  /**
   * Obtener movimientos de Kardex por almacén y periodo
   */
  static async listarPorAlmacen(
    idAlmacen: number,
    mes: number,
    yearcito: number,
  ) {
    const response = await api.get<IRespuesta<RES_MovimientoKardex[]>>(
      this.PATH,
      {
        params: {
          id_almacen: idAlmacen,
          mes,
          yearcito,
        },
      },
    );
    return response.data;
  }
}
