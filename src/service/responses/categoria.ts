import type { TipoBien } from "../../shared/enums/_generic/tipo-producto";

export interface RES_Categoria {
  id_categoria: number;
  nombre: string;
  es_auditable: boolean;
  clasificacion_bien: TipoBien;
}
