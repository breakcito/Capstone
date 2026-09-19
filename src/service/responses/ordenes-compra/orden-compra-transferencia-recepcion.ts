import type {
  Estado_OCTransRecepcion,
  Estado_OCTransRecepcionDetalle,
} from "../../../shared/enums/orden-compra/orden-compra-transferencia-recepcion";
import type { IArchivo } from "../../../shared/interfaces/archivo";

export interface RES_OCTransRecepcion {
  id_recepcion: number;
  id_orden_compra_transferencia: number;
  //
  numero_correlativo: number;
  //
  empleado_registro: string;
  //
  observacion: string | null;
  fecha_hora_recepcion: string;
  evidencias: IArchivo[] | null;
  con_incidencia: boolean;
  //
  created_at: string;
  estado: Estado_OCTransRecepcion;
  //
  detalles?: RES_OCTransRecepcionDetalle[];
}

export interface RES_OCTransRecepcionDetalle {
  id_recepcion_detalle: number;
  id_orden_compra_transferencia_recepcion: number;
  id_orden_compra_transferencia_detalle: number;
  //
  id_producto: number;
  producto: string;
  //
  id_unidad_medida_base: number;
  unidad_medida_base_abv: string;
  cantidad_recepcionada_base: number;
  //
  contenido_por_presentacion: number;
  //
  id_unidad_medida_oc: number;
  unidad_medida_oc_abv: string;
  cantidad_recepcionada_oc: number;
  //
  estado: Estado_OCTransRecepcionDetalle;
}
