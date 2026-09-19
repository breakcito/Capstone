import type { RES_DetalleRequerimiento } from "../../../service/responses/requerimientos-almacen/requerimiento-almacen";

/**
 * Representa un item de detalle con campos adicionales calculados para la UI
 */
export interface DetalleRequerimientoExtendido extends RES_DetalleRequerimiento {
  pendiente_base: number;
  equivReq: number;
  porcentaje_progreso?: number;
  tipo_bien?: string;
  para_mantenimiento?: boolean;
  producto_para_mantenimiento?: boolean;
  id_activo_fijo_destino?: number | null;
  es_auditable?: boolean;
}
