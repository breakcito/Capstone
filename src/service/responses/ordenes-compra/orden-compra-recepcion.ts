import type { TipoBien } from "../../../shared/enums/_generic/tipo-bien";
import type {
  Estado_OrdenCompraRecepcion,
  Estado_OrdenCompraRecepcionDetalle,
} from "../../../shared/enums/orden-compra/orden-compra-recepcion";
import type { IArchivo } from "../../../shared/interfaces/archivo";

export interface RES_OrdenCompraRecepcion {
  id_recepcion: number;
  id_orden_compra: number;
  //
  numero_correlativo: number;
  //
  id_almacen_recepcionista: number;
  almacen_recepcionista: string;
  es_para_un_almacen_principal: boolean;
  //
  empleado_recepcion: string;
  //
  observacion: string | null;
  fecha_hora_recepcion: string;
  guia_remision: string | null;
  con_incidencia: boolean;
  evidencias: IArchivo[] | null;
  //
  tiene_comprobante: boolean;
  //
  created_at: string;
  estado: Estado_OrdenCompraRecepcion;
  //
  detalles?: RES_OrdenCompraRecepcionDetalle[];
}

export interface RES_OrdenCompraRecepcionDetalle {
  id_recepcion_detalle: number;
  id_orden_compra_recepcion: number;
  id_orden_compra_detalle: number;
  //
  id_producto: number;
  producto: string;
  tipo_bien: TipoBien;
  //
  id_activo_fijo: number | null;
  correlativo_activo_fijo: string | null;
  //
  id_almacen_destino: number;
  almacen_destino: string;
  //
  id_mina_destino: number;
  mina_destino: string;
  //
  id_unidad_medida_base: number;
  unidad_medida_base_abv: string;
  //
  id_unidad_medida_oc: number;
  unidad_medida_oc_abv: string;
  //
  cantidad_recepcionada: number;
  cantidad_recepcionada_base: number;
  //
  es_para_otro_almacen: boolean;
  cantidad_transferida_base: number | null;
  //
  comentario: string | null;
  estado: Estado_OrdenCompraRecepcionDetalle;
}
