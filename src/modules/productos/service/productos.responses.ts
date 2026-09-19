import type { EstadoBase } from "../../../shared/enums/_generic/estado-base";
import type { TipoProducto } from "../../../shared/enums/_generic/tipo-producto";
import type { RES_CambiosLog } from "../../../service/responses/_generic/cambios-log";

export interface RES_ProductoResumen {
  id_producto: number;
  nombre: string;
  tipo_producto?: TipoProducto | string | null;
  //
  id_unidad_medida_base: number;
  unidad_medida_base: string;
  unidad_medida_base_abreviatura: string;
  //
  es_perecible: boolean;
  stock_minimo_base: number;
  //
  tiempo_espera_vencimiento: number | null;
  periodo_espera_vencimiento: string | null;
  dias_espera_vencimiento: number | null;
  //
  cambios_log?: RES_CambiosLog[] | null;
  //
  estado: EstadoBase;
}
