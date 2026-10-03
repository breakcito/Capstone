import { Estado_RequerimientoDetalle } from "../../../shared/enums/requerimiento-almacen/requerimiento";
import { z } from "zod";

/**
 * Quien solicita el requerimiento puede ser un contratista (dato de
 * negocio) o un empleado interno. Ambos viven en la tabla `empleado`:
 * los contratistas tienen `es_contratista = 1`.
 *
 * Reglas al guardar:
 * - Si `solicitante_es_contratista = true`  → se guarda el id en
 *   `requerimiento_almacen.id_contratista_solicitante` y
 *   `id_empleado_registro` queda con el empleado logueado (quien registra).
 * - Si `solicitante_es_contratista = false` → se guarda el id en
 *   `requerimiento_almacen.id_empleado_registro` (sobrescribiendo al
 *   logueado, porque el solicitante ES ese empleado) y
 *   `id_contratista_solicitante` queda null.
 *
 * Por eso el campo `id_contratista_solicitante` del DTO se usa en realidad
 * como "id del solicitante" (la BD lo guarda en la columna que corresponda
 * segun el flag).
 */
export interface DTO_CrearRequerimiento {
  /**
   * Id del solicitante (sea contratista o empleado). Es el id de la
   * tabla `empleado`. El backend decide en que columna persiste segun
   * `solicitante_es_contratista`.
   */
  id_contratista_solicitante?: number | null;
  /**
   * Si el solicitante es un contratista (true) o un empleado (false).
   * Determina en que columna de la BD se persiste el id.
   */
  solicitante_es_contratista?: boolean;
  id_almacen_destino: number;
  fecha_solicitud?: string | null;
  observacion?: string | null;
  detalles: DTO_CrearRequerimientoDetalle[];
  evidencias?: File[] | null;
}

export interface DTO_CrearRequerimientoDetalle {
  id_producto: number;
  id_unidad_medida: number;
  cantidad_solicitada: number;
  contenido_por_presentacion: number;
  comentario?: string | null;
  con_magnitud?: boolean | number;
  cantidad_items?: number;
  valor_magnitud?: number;
  valor_magnitud_base?: number;
}

export const Schema_CrearRequerimientoDetalle = z.object({
  id_producto: z.number().min(1, "Seleccione un producto"),
  id_unidad_medida: z.number().min(1, "Seleccione una unidad"),
  cantidad_solicitada: z.number().min(0.01, "La cantidad debe ser mayor a 0"),
  contenido_por_presentacion: z
    .number()
    .min(0.0001, "El contenido debe ser mayor a 0"),
  comentario: z.string().nullable().optional(),
  con_magnitud: z.union([z.boolean(), z.number()]).optional(),
  cantidad_items: z.number().optional(),
  valor_magnitud: z.number().optional(),
  valor_magnitud_base: z.number().optional(),
});

export const Schema_CrearRequerimiento = z.object({
  id_contratista_solicitante: z.number().nullable().optional(),
  id_almacen_destino: z.number().min(1, "Seleccione un almacén de destino"),
  fecha_solicitud: z.string().nullable().optional(),
  observacion: z.string().nullable().optional(),
  detalles: z
    .array(Schema_CrearRequerimientoDetalle)
    .min(1, "Debe agregar al menos un producto"),
});

export interface DTO_AtencionCambiarEstado {
  id_requerimiento_almacen_detalle?: number;
  ids_detalles?: number[];
  nuevo_estado: Estado_RequerimientoDetalle;
  comentario_decision?: string;
}

export interface DTO_DetalleEditado {
  id_requerimiento_almacen_detalle: number;
  id_unidad_medida?: number;
  cantidad_solicitada?: number;
  contenido_por_presentacion?: number;
  comentario?: string | null;
  con_magnitud?: boolean | number;
  cantidad_items?: number;
  valor_magnitud?: number;
  valor_magnitud_base?: number;
}

export interface DTO_EditarRequerimiento {
  id_contratista_solicitante?: number | null;
  solicitante_es_contratista?: boolean;
  fecha_solicitud?: string;
  observacion?: string;
  evidencias_nuevas?: File[];
  detalles_editar?: DTO_DetalleEditado[];
  detalles_eliminar?: number[];
  detalles_crear?: DTO_CrearRequerimientoDetalle[];
}

export interface DTO_RegistrarEntrega {
  id_requerimiento: number;
  /**
   * Empleado que recibe la entrega. Si es un contratista, su id
   * tambien va aqui (los contratistas viven en la tabla empleado
   * con es_contratista=1).
   */
  id_empleado_recibe?: number | null;
  fecha_entrega: string;
  observacion?: string;
  evidencias?: File[];
  detalles: DTO_RegistrarEntregaDetalle[];
}

export interface DTO_RegistrarEntregaDetalle {
  id_requerimiento_almacen_detalle: number;
  id_lote_producto?: number;
  id_activo_fijo?: number | null;
  cantidad_base: number;
  cantidad_lote: number;
  cantidad_requerimiento: number;
  // NOTA: campos viejos del modelo anterior que ya no aplican
  // (para_produccion, id_lote_mineral, etc). Se eliminaron
  // para alinear con la nueva estructura de la BD.
}
