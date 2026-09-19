import type { EstadoBase } from "../../shared/enums/_generic/estado-base";

export interface RES_Area {
  id_area: number;
  nombre: string;
  //
  estado: EstadoBase;
  // insertado por la api
  cargos?: RES_Cargo[];
}

export interface RES_Cargo {
  id_cargo: number;
  id_area: number | null;
  nombre: string;
  estado: EstadoBase;
}
