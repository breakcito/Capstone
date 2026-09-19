export interface RES_ActivoFijoDisponible {
  id_activo: number;
  correlativo: string;
  //
  id_almacen: number | null;
  almacen: string | null;
  en_almacen_principal: boolean | null;
  //
  id_mina: number | null;
  mina: string | null;
  //
  id_producto: number;
  producto: string;
  es_auditable: boolean;
  //
  id_categoria: number;
  categoria: string;
  //
  para_transporte: boolean;
  control_por_odometro: boolean;
  control_por_horometro: boolean;
  control_por_vueltas: boolean;
  //
  id_unidad_medida_base: number;
  unidad_medida_base: string;
  unidad_medida_base_abv: string;
}
