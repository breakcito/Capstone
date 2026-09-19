export interface RES_TarifaCarbon {
  id_tarifa_carbon: number;
  id_tipo_carbon: number;
  tipo_carbon_nombre: string;
  tipo_carbon_codigo: string | null;
  inicio_porcentaje_ceniza: number;
  fin_porcentaje_ceniza: number;
  precio_unitario: number;
  estado: string;
}
