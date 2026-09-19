import type { MedioEntrega } from "../../../shared/enums/_generic/medio-entrega";
import type { TipoBien } from "../../../shared/enums/_generic/tipo-bien";
import type {
  Estado_SolicitudEntrega,
  Estado_SolicitudEntregaDetalle,
} from "../../../shared/enums/solicitud-reabastecimiento/solicitud-entrega";
import type { IArchivo } from "../../../shared/interfaces/archivo";

export interface RES_SolicitudEntrega {
  id_reabastecimiento_entrega: number;
  id_solicitud_reabastecimiento: number;
  //
  id_almacen_entrega: number;
  almacen_entrega: string;
  //
  empleado_entrega: string;
  empleado_recibe: string;
  //
  medio_entrega: MedioEntrega;
  id_proveedor_transporte: number | null;
  proveedor_transporte: string | null;
  id_agencia_transporte: number | null;
  agencia_transporte: string | null;
  numero_factura: string | null;
  serie_factura: string | null;
  serie_guia_transportista: string | null;
  numero_guia_transportista: string | null;
  serie_guia_remitente: string | null;
  numero_guia_remitente: string | null;
  costo_envio: number | null;
  //
  correlativo: string;
  fecha_hora_entrega: string;
  observacion: string | null;
  evidencias: IArchivo[] | null;
  created_at: string;
  estado: Estado_SolicitudEntrega;
  // Datos insertados por la api
  detalles?: RES_SolicitudEntregaDetalle[];
}

export interface RES_SolicitudEntregaDetalle {
  id_entrega_detalle: number;
  id_reabastecimiento_entrega: number;
  id_solicitud_reabastecimiento_detalle: number;
  //
  id_producto: number;
  producto: string;
  es_perecible: boolean;
  tipo_bien: TipoBien;
  //
  id_lote_producto: number | null;
  lote_correlativo: string | null;
  fecha_vencimiento: string | null;
  lote_serie_factura?: string | null;
  lote_numero_factura?: string | null;
  lote_costo_por_unidad?: number | null;
  lote_id_orden_compra_detalle?: number | null;
  lote_id_orden_compra?: number | null;
  lote_id_orden_compra_comprobante?: number | null;
  //
  id_activo_fijo: number | null;
  correlativo_activo_fijo: string | null;
  //
  id_unidad_medida_base: number;
  unidad_medida_base_abv: string;
  cantidad_base: number;
  //
  id_unidad_medida_lot: number;
  unidad_medida_lot_abv: string;
  contenido_por_presentacion_lot: number;
  cantidad_lote: number;
  //
  id_unidad_medida_sol: number;
  unidad_medida_sol_abv: string;
  contenido_por_presentacion_sol: number;
  cantidad_solicitud: number;
  //
  cantidad_recibida_total_base: number;
  //
  //
  estado: Estado_SolicitudEntregaDetalle;
}
