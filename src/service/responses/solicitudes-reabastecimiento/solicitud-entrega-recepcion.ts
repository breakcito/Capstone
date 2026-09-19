import type {
  Estado_SolicitudEntregaRecepcion,
  Estado_SolicitudEntregaRecepcionDetalle,
} from "../../../shared/enums/solicitud-reabastecimiento/solicitud-entrega-recepcion";
import type { IArchivo } from "../../../shared/interfaces/archivo";

export interface RES_SolicitudRecepcion {
  id_recepcion: number;
  id_solicitud_reabastecimiento_entrega: number;
  //
  empleado_registro: string;
  //
  observacion: string | null;
  fecha_hora_recepcion: string;
  evidencias: IArchivo[] | null;
  con_incidencia: boolean;
  created_at: string;
  estado: Estado_SolicitudEntregaRecepcion;
  // Insertado por la api
  detalles: RES_SolicitudRecepcionDetalle[];
}

export interface RES_SolicitudRecepcionDetalle {
  id_recepcion_detalle: number;
  id_solicitud_reabastecimiento_recepcion: number;
  id_solicitud_reabastecimiento_entrega_detalle: number;
  //
  id_producto: number;
  producto: string;
  //
  id_unidad_medida_base: number;
  unidad_medida_base_abv: string;
  cantidad_recepcionada_base: number;
  //
  id_unidad_medida_sol: number;
  unidad_medida_sol_abv: string;
  contenido_por_presentacion_sol: number;
  cantidad_recepcionada_sol: number;
  //
  estado: Estado_SolicitudEntregaRecepcionDetalle;
}
