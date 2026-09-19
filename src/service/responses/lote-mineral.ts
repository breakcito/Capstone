import type { EstadoLoteMineral } from "../../shared/enums/lote-mineral";

export interface RES_LoteMineral {
  id_lote_mineral: number;
  //
  id_mina: number;
  mina: string;
  //
  id_labor: number;
  labor: string;
  //
  id_contratista: number;
  contratista: string;
  //
  codigo: string;
  descripcion: string | null;
  fecha_inicio_produccion: string;
  //
  estado: EstadoLoteMineral;
}
