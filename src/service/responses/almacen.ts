export interface RES_Almacen {
  id_almacen: number;
  nombre: string;
  es_principal: number;
  para_carbon: number;
  direccion: string | null;
  id_departamento: number | null;
  id_provincia: number | null;
  id_distrito: number | null;
  departamento_nombre: string | null;
  provincia_nombre: string | null;
  distrito_nombre: string | null;
}