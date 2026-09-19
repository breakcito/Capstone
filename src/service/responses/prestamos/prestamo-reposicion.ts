import type { MedioEntrega } from "../../../shared/enums/_generic/medio-entrega";
import type { TipoBien } from "../../../shared/enums/_generic/tipo-bien";
import type {
  Estado_PrestamoReposicion,
  Estado_PrestamoReposicionDetalle,
} from "../../../shared/enums/prestamo-almacen/prestamo-reposicion";
import type { IArchivo } from "../../../shared/interfaces/archivo";
import type { RES_PrestamoReposicionRecepcion } from "./prestamo-reposicion-recepcion";

export interface RES_PrestamoReposicion {
  id_reposicion: number;
  id_prestamo_almacen: number;
  //
  id_almacen_entrega: number;
  almacen_entrega: string;
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
  fecha_hora_reposicion: string;
  observacion: string | null;
  evidencias: IArchivo[] | null;
  registrado_por: string;
  empleado_recibe: string;
  created_at: string;
  estado: Estado_PrestamoReposicion;
  // Insertado por la api
  recepciones: RES_PrestamoReposicionRecepcion[];
  detalles: RES_PrestamoReposicionDetalle[];
}

export interface RES_PrestamoReposicionDetalle {
  id_reposicion_detalle: number;
  id_prestamo_almacen_detalle: number;
  //
  id_producto: number;
  producto: string;
  es_perecible: boolean;
  tipo_bien: TipoBien;
  //
  id_unidad_medida_base: number;
  unidad_medida_base: string;
  unidad_medida_base_abv: string;
  cantidad_base: number;
  //
  id_lote_producto: number | null;
  lote_correlativo: string | null;
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
  id_unidad_medida_lote: number;
  unidad_medida_lote: string;
  unidad_medida_lote_abv: string;
  cantidad_lote: number;
  //
  id_unidad_medida_pr: number;
  unidad_medida_pr_abv: string;
  cantidad_prestamo: number;
  //
  cantidad_recibida_total_base?: number;
  //
  estado: Estado_PrestamoReposicionDetalle;
}
