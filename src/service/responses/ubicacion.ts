export interface RES_Departamento {
  id: number;
  codigo: string;
  nombre: string;
}

export interface RES_Provincia {
  id: number;
  codigo: string;
  nombre: string;
  id_departamento: number;
}

export interface RES_Distrito {
  id: number;
  codigo: string;
  nombre: string;
  id_provincia: number;
  id_departamento: number;
}