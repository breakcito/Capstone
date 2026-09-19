export interface RES_UnidadMedida {
  id_unidad_medida: number;
  nombre: string;
  abreviatura: string;
  es_universal: number | boolean;
  conversiones?: {
    id_unidad_destino: number;
    id_unidad_origen: number;
    factor_conversion: number;
  }[];
}
