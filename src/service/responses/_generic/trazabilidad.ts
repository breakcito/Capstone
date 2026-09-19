/**
 * Interface reutilizable para la trazabilidad de cualquier proceso
 */
export interface RES_Trazabilidad {
  id_log: number;
  descripcion: string;
  created_at: string;
  empleado: string;
  url_foto: string | null;
  estado: string;
}
