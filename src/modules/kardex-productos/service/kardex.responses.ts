import type { Moneda } from "../../../shared/enums/_generic/moneda";
import type {
  Kardex_OrigenMovimiento,
  Kardex_TipoMovimiento,
} from "../../../shared/enums/kardex";

export interface RES_MovimientoKardex {
  id_kardex: number;
  //
  id_producto: number;
  producto: string;
  es_auditable: boolean;
  //
  id_categoria: number;
  categoria: string;
  //
  id_lote_producto: number | null;
  correlativo_lote: string | null;
  contenido_por_presentacion: number | null;
  //
  id_activo_fijo: number | null;
  correlativo_activo_fijo: string | null;
  //
  id_unidad_medida_base: number;
  unidad_medida_base: string;
  unidad_medida_base_abv: string;
  //
  id_unidad_medida_lote: number | null;
  unidad_medida_lote: string | null;
  unidad_medida_lote_abv: string | null;
  //
  tipo_movimiento: Kardex_TipoMovimiento;
  tipo_origen: Kardex_OrigenMovimiento;
  descripcion: string | null;
  //
  stock_anterior: number | null; // cuando es por un nuevo lote
  stock_anterior_base: number | null; // cuando es por un nuevo lote
  //
  cantidad_movimiento: number;
  cantidad_movimiento_base: number;
  //
  stock_resultante: number;
  stock_resultante_base: number;
  //
  moneda: Moneda;
  costo_promedio_base: number;
  costo_promedio_por_presentacion: number;
  subtotal_promedio: number;
  // en soles, solo si se coloco el costo en el lote
  costo_por_unidad_base: number | null;
  costo_por_unidad: number | null;
  subtotal: number | null;
  //
  created_at: string;
}
