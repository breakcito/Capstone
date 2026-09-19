import type { MedioEntrega } from "../../../shared/enums/_generic/medio-entrega";
import type { TipoBien } from "../../../shared/enums/_generic/tipo-bien";
import type {
  Estado_PrestamoEntrega,
  Estado_PrestamoEntregaDetalle,
} from "../../../shared/enums/prestamo-almacen/prestamo-entrega";
import type { IArchivo } from "../../../shared/interfaces/archivo";
import type { RES_PrestamoEntregaRecepcion } from "./prestamo-entrega-recepcion";

export interface RES_PrestamoEntrega {
  id_prestamo_entrega: number;
  id_prestamo_almacen: number;
  id_solicitud_reabastecimiento: number;
  //
  id_almacen_entrega: number;
  almacen_entrega: string;
  //
  empleado_entrega: string;
  empleado_recibe: string;
  //
  correlativo: string;
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
  fecha_hora_entrega: string;
  observacion: string | null;
  evidencias: IArchivo[] | null;
  created_at: string;
  estado: Estado_PrestamoEntrega;
  // Datos insertados por la api
  detalles: RES_PrestamoEntregaDetalle[];
  recepciones: RES_PrestamoEntregaRecepcion[];
}

export interface RES_PrestamoEntregaDetalle {
  id_entrega_detalle: number;
  id_prestamo_almacen_entrega: number;
  id_prestamo_almacen_detalle: number;
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
  // Seguna la unidad base del producto
  id_unidad_medida_base: number;
  unidad_medida_base_abv: string;
  cantidad_base: number;
  cantidad_total_recepcionada_base: number;
  // Segun la unidad de medida del lote usado para la entrega
  id_unidad_medida_lot: number;
  unidad_medida_lot_abv: string;
  contenido_por_presentacion_lot: number;
  cantidad_lot: number;
  // Seguna la unidad de medida del detalle del prestamo
  id_unidad_medida_pr: number;
  unidad_medida_pr_abv: string;
  contenido_por_presentacion_pr: number;
  cantidad_prestamo: number;
  //
  estado: Estado_PrestamoEntregaDetalle;
}
