import type { EstadoVencimientoProducto } from "../../../shared/enums/_generic/estado-vencimiento-producto";
import type { Estado_EntregaRequerimiento } from "../../../shared/enums/requerimiento-almacen/requerimiento-entrega";
import type { IArchivo } from "../../../shared/interfaces/archivo";

/**
 * Representa una entrega de materiales
 */
export interface RES_EntregaRequerimiento {
  id_requerimiento_almacen_entrega: number;
  empleado_entrega: string;
  empleado_recibe: string | null;
  contratista_recibe: string | null;
  correlativo: string;
  fecha_hora_entrega: string;
  observacion: string | null;
  evidencias: IArchivo[] | null;
  created_at: string;
  estado: Estado_EntregaRequerimiento;
  cantidad: number;
}

/**
 * El detalle técnico de lo entregado (por lote)
 */
export interface RES_DetalleEntregaRequerimiento {
  id_entrega_detalle: number;
  id_requerimiento_almacen_detalle: number;
  //
  id_lote_producto: number;
  correlativo: string; // del lote
  fecha_vencimiento: string | null;
  //
  id_activo_fijo: number;
  correlativo_activo_fijo: string;
  //
  producto: string;
  //
  dias_para_vencer: number | null;
  estado_vencimiento: EstadoVencimientoProducto;
  //
  cantidad_base: number;
  cantidad_lote: number;
  cantidad_requerimiento: number;
  //
  unidad_lote: string;
  unidad_lote_abv: string;
  unidad_base: string;
  unidad_base_abv: string;
}
