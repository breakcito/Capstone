import type { TipoLabor } from "../../shared/enums/labor-minera";

export interface RES_Labor {
  id_labor: number;
  id_mina: number;
  mina: string;
  tipo_labor: TipoLabor | null;
  nombre: string;
  prefijo: string;
}
