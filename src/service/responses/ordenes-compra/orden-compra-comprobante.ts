import type { TipoComprobante } from "../../../shared/enums/_generic/tipo-comprobante";
import type { IArchivo } from "../../../shared/interfaces/archivo";
import type { Estado_OrdenCompraRecepcion } from "../../../shared/enums/orden-compra/orden-compra-recepcion";
import type { Estado_OCComprobante } from "../../../shared/enums/orden-compra/orden-compra-comprobante";

export interface RES_OCComprobante {
  id_comprobante: number;
  id_orden_compra: number;
  tipo_comprobante: TipoComprobante;
  serie: string;
  numero: string;
  fecha_emision: string;
  observacion: string | null;
  evidencias: IArchivo[] | null;
  moneda: string;
  tipo_cambio_venta_aplicado: number;
  es_auditable: number;
  total_antes_igv: number;
  total_antes_igv_soles: number;
  incluye_igv: number;
  porcentaje_igv: number;
  monto_igv: number;
  monto_igv_soles: number;
  total_despues_igv: number;
  total_despues_igv_soles: number;
  id_empleado_registro: number;
  empleado_registro: string;
  created_at: string;
  estado: Estado_OCComprobante;
  recepciones_agrupadas: RES_OCComprobanteRecepcion[];
}

export interface RES_OCComprobanteRecepcion {
  id_orden_compra_comprobante: number;
  id_orden_compra_recepcion: number;
  id_orden_compra: number;
  numero_correlativo: number;
  id_almacen_recepcionista: number;
  almacen_recepcionista: string;
  para_un_almacen_principal: number;
  empleado_recepcion: string;
  fecha_hora_recepcion: string;
  guia_remision: string;
  estado: Estado_OrdenCompraRecepcion;
}
