import type {
  Estado_OCTransferencia,
  Estado_OCTransferenciaDetalle,
} from "../../../shared/enums/orden-compra/orden-compra-transferencia";
import type { IArchivo } from "../../../shared/interfaces/archivo";
import type { TipoBien } from "../../../shared/enums/_generic/tipo-bien";
import type { MedioEntrega } from "../../../shared/enums/_generic/medio-entrega";

export interface RES_OCTransferencia {
  id_transferencia: number;
  correlativo: string;
  es_auditable: boolean;
  //
  codigo_orden_compra: string;
  //
  id_recepcion: number;
  numero_recepcion: number;
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
  almacen_origen: string;
  desde_un_almacen_principal: boolean;
  //
  id_almacen_destino: number;
  almacen_destino: string;
  es_para_un_almacen_principal: boolean;
  //
  empleado_transferencia: string;
  empleado_recibe: string;
  //
  fecha_hora_transferencia: string;
  observacion: string | null;
  evidencias: IArchivo[] | null;
  //
  created_at: string;
  estado: Estado_OCTransferencia;
  //
  detalles?: RES_OCTransferenciaDetalle[];
}

export interface RES_OCTransferenciaDetalle {
  id_transferencia_detalle: number;
  id_orden_compra_transferencia: number;
  id_orden_compra_recepcion_detalle: number;
  //
  id_producto: number;
  producto: string;
  tipo_bien: TipoBien;
  //
  // lote (null para activos fijos)
  id_lote_producto: number | null;
  lote_correlativo: string | null;
  lote_serie_factura?: string | null;
  lote_numero_factura?: string | null;
  lote_costo_por_unidad?: number | null;
  lote_id_orden_compra_detalle?: number | null;
  lote_id_orden_compra?: number | null;
  lote_id_orden_compra_comprobante?: number | null;
  //
  // activo (null para productos comunes)
  id_activo_fijo: number | null;
  correlativo_activo_fijo: string | null;
  //
  id_unidad_medida_base: number;
  unidad_medida_base_abv: string;
  cantidad_transferida_base: number;
  //
  id_unidad_medida_lot: number;
  unidad_medida_lot_abv: string;
  contenido_por_presentacion_lot: number;
  cantidad_transferida_lot: number;
  //
  id_unidad_medida_oc: number;
  unidad_medida_oc_abv: string;
  contenido_por_presentacion_oc: number;
  cantidad_transferida_oc: number;
  //
  comentario: string | null;
  estado: Estado_OCTransferenciaDetalle;
}
