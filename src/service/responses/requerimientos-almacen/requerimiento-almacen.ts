import type {
  Estado_Requerimiento,
  Estado_RequerimientoDetalle,
} from "../../../shared/enums/requerimiento-almacen/requerimiento";
import type { IArchivo } from "../../../shared/interfaces/archivo";

/**
 * Representa un requerimiento en el resumen de atención
 */
export interface RES_RequerimientoAlmacen {
  id_requerimiento: number;
  id_almacen_destino: number;
  almacen_destino: string;
  id_contratista_solicitante: number | null;
  solicitante: string;
  empleado_registro: string;
  correlativo: string;
  evidencias: IArchivo[] | null;
  observacion: string | null;
  fecha_solicitud: string | null;
  estado: Estado_Requerimiento;
  created_at: string;
  detalles?: RES_DetalleRequerimiento[];
}

/**
 * Representa un item de detalle de un requerimiento
 */
export interface RES_DetalleRequerimiento {
  id_requerimiento_almacen_detalle: number;
  id_producto: number;
  producto: string;
  stock_minimo_base: number;
  id_unidad_medida_base: number;
  unidad_medida_base_abv: string;
  contenido_por_presentacion: number;
  cantidad_solicitada_base: number;
  cantidad_entregada_base?: number;
  id_unidad_medida_req: number;
  unidad_medida_req_abv: string;
  cantidad_solicitada: number;
  cantidad_entregada?: number;
  stock_disponible_base: number;
  comentario: string | null;
  estado: Estado_RequerimientoDetalle;
  con_magnitud?: number | boolean;
  cantidad_items?: number | null;
  valor_magnitud?: number | null;
  valor_magnitud_base?: number | null;
}
