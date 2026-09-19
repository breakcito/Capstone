import type { EstadoBase } from "../../shared/enums/_generic/estado-base";
import type { TipoEntidad } from "../../shared/enums/_generic/tipo-entidad";

export interface RES_Proveedor {
  id_proveedor: number;
  razon_social: string;
  direccion: string | null;
  ruc: string | null;
  dni: string | null;
  tipo_entidad: TipoEntidad;
  para_mantenimiento: boolean;
  para_transporte: boolean;
  para_carbon: boolean;
  estado: EstadoBase;
  cantidad_cuentas_bancarias?: number;
}