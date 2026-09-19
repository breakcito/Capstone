import type { EstadoBase } from "../../shared/enums/_generic/estado-base";

export interface RES_PersonalExterno {
  id_personal: number;
  id_proveedor: number | null;
  nombre: string;
  apellido: string;
  dni: string;
  estado: EstadoBase;
}