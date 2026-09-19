export interface RES_LugarExtraccionCarbon {
  id_lugar_extraccion: number;
  id_proveedor: number;
  id_departamento: number;
  departamento_nombre: string;
  id_provincia: number;
  provincia_nombre: string;
  id_distrito: number;
  distrito_nombre: string;
  direccion: string;
  estado?: string;
}
