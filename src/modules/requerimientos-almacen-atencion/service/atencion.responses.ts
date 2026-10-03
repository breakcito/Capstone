import type { RES_DetalleRequerimiento } from "../../../service/responses/requerimientos-almacen/requerimiento-almacen";

/**
 * Representa un item de detalle con campos adicionales calculados para la UI.
 * Los campos para_mantenimiento / id_activo_fijo_destino se eliminaron
 * porque la tabla requerimiento_almacen_detalle ya no las tiene.
 */
export interface DetalleRequerimientoExtendido extends RES_DetalleRequerimiento {
  pendiente_base: number;
  equivReq: number;
  porcentaje_progreso?: number;
  tipo_bien?: string;
  es_auditable?: boolean;
}
