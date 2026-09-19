import type { RES_DetalleRequerimiento } from "../../../service/responses/requerimientos-almacen/requerimiento-almacen";

/**
 * Representa un item de detalle con campos adicionales calculados para la UI
 */
export interface DetalleRequerimientoExtendido extends RES_DetalleRequerimiento {
  pendiente_base: number;
  equivReq: number;
}
