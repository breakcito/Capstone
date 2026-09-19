import type { TipoEntidad } from "../../shared/enums/_generic/tipo-entidad";

export interface RES_Transportista {
  id_transportista: number;
  tipo_entidad: TipoEntidad | string;
  razon_social: string;
  ruc: string | null;
  dni: string | null;
  telefono: string | null;
  estado: string;
}
