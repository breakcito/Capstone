import type { Moneda } from "../../shared/enums/_generic/moneda";
import type { TipoBien } from "../../shared/enums/_generic/tipo-bien";

export interface RES_Producto {
  id_producto: number;
  nombre: string;
  //
  id_categoria: number;
  categoria: string;
  es_consumible: boolean;
  tipo_bien: TipoBien;
  para_transporte?: boolean | number;
  //
  stock_minimo_base: number;
  //
  id_unidad_medida_base: number;
  unidad_medida_base: string;
  unidad_medida_base_abv: string;
  //
  es_perecible: boolean;
  es_auditable: boolean;
  para_mantenimiento: boolean;
  //
  prefijo: string | null;
  moneda: Moneda;
  costo_promedio_base: number;
  //
  dias_espera_vencimiento: number | null;
}
