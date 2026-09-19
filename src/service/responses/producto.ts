import type { TipoProducto, TipoBien } from "../../shared/enums/_generic/tipo-producto";
import type { Periodo } from "../../shared/enums/_generic/periodo";

export interface RES_Producto {
  id_producto: number;
  nombre: string;
  tipo_producto: TipoProducto;
  stock_minimo_base: number;
  id_unidad_medida_base: number;
  unidad_medida_base: string;
  unidad_medida_base_abv: string;
  es_perecible: boolean;
  tiempo_espera_vencimiento?: number | null;
  periodo_espera_vencimiento?: Periodo | null;
  dias_espera_vencimiento: number | null;
  estado?: string;
  tipo_bien?: TipoProducto | TipoBien | string;
  para_mantenimiento?: boolean;
  producto_para_mantenimiento?: boolean;
  prefijo?: string | null;
  id_categoria?: number | null;
  categoria?: string | null;
  es_auditable?: boolean;
  moneda?: string | null;
  costo_promedio_base?: number | null;
  clasificacion_bien?: TipoBien;
}
