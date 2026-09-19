import type { EstadoBase } from "../../shared/enums/_generic/estado-base";

export interface RES_Oficina {
  id_oficina: number;
  //
  id_empresa: number;
  empresa: string;
  //
  nombre: string;
  direccion?: string;
  es_principal: boolean;
  estado: EstadoBase;
}
