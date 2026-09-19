import type {
  Estado_PrestamoEntregaRecepcion,
  Estado_PrestamoEntregaRecepcionDetalle,
} from "../../../shared/enums/prestamo-almacen/prestamo-entrega-recepcion";
import type { IArchivo } from "../../../shared/interfaces/archivo";

export interface RES_PrestamoEntregaRecepcion {
  id_recepcion: number;
  id_prestamo_almacen_entrega: number;
  //
  empleado_registro: string;
  //
  observacion: string | null;
  fecha_hora_recepcion: string;
  evidencias: IArchivo[] | null;
  con_incidencia: boolean;
  created_at: string;
  estado: Estado_PrestamoEntregaRecepcion;
  // Insertado por la api
  detalles: RES_PrestamoEntregaRecepcionDetalle[];
}

export interface RES_PrestamoEntregaRecepcionDetalle {
  id_recepcion_detalle: number;
  id_prestamo_almacen_entrega_detalle: number;
  id_prestamo_almacen_recepcion: number;
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
  id_unidad_medida_pr: number;
  unidad_medida_pr_abv: string;
  cantidad_recepcionada_pr: number;
  //
  estado: Estado_PrestamoEntregaRecepcionDetalle;
}
