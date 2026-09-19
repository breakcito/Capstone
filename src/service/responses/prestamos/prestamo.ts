import type {
  Estado_Prestamo,
  Estado_PrestamoDetalle,
  EstadoReposicion_Prestamo,
} from "../../../shared/enums/prestamo-almacen/prestamo";
import type { TipoBien } from "../../../shared/enums/_generic/tipo-bien";

export interface RES_Prestamo {
  id_prestamo: number;
  correlativo: string;
  //
  id_almacen_solicitante: number;
  almacen_solicitante: string;
  //
  id_almacen_prestamista: number;
  almacen_prestamista: string;
  //
  id_solicitud_reabastecimiento: number;
  solicitud_reabastecimiento: string;
  //
  fecha_hora_prestamo: string;
  fecha_limite_devolucion: string;
  observacion: string | null;
  es_auditable: boolean;
  registrado_por: string;
  //
  created_at: string;
  estado_reposicion: EstadoReposicion_Prestamo;
  estado: Estado_Prestamo;
}

export interface RES_PrestamoDetalle {
  id_prestamo_detalle: number;
  id_solicitud_reabastecimiento_detalle: number;
  //
  id_producto: number;
  stock_minimo_base: number;
  producto: string;
  tipo_bien: TipoBien;
  //
  stock_disponible_base: number;
  //
  id_unidad_medida_base: number;
  unidad_medida_base_abv: string;
  //
  id_unidad_medida_pr: number;
  unidad_medida_pr_abv: string;
  //
  cantidad_solicitada: number;
  contenido_por_presentacion: number;
  cantidad_solicitada_base: number;
  //
  cantidad_prestada: number;
  cantidad_prestada_base: number;
  //
  cantidad_repuesta: number;
  cantidad_repuesta_base: number;
  //
  comentario: string | null;
  estado: Estado_PrestamoDetalle;
}
