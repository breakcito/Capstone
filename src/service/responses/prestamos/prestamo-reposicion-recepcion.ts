import type {
  Estado_PrestamoReposicionRecepcion,
  Estado_PrestamoReposicionRecepcionDetalle,
} from "../../../shared/enums/prestamo-almacen/prestamo-reposicion-recepcion";
import type { IArchivo } from "../../../shared/interfaces/archivo";

export interface RES_PrestamoReposicionRecepcion {
  id_recepcion: number;
  id_reposicion: number;
  //
  empleado_registro: string;
  //
  fecha_hora_recepcion: string;
  observacion: string | null;
  evidencias: IArchivo[] | null;
  con_incidencia: boolean;
  created_at: string;
  estado: Estado_PrestamoReposicionRecepcion;
  // Insertado por la api
  detalles?: RES_PrestamoReposicionRecepcionDetalle[];
}

export interface RES_PrestamoReposicionRecepcionDetalle {
  id_recepcion_detalle: number;
  id_recepcion: number;
  id_reposicion_detalle: number;
  //
  id_producto: number;
  producto: string;
  //
  id_unidad_medida_base: number;
  unidad_medida_base_abv: string;
  //
  cantidad_recepcionada_base: number;
  estado: Estado_PrestamoReposicionRecepcionDetalle;
}
