/**
 * Interface reutilizable para la trazabilidad de los cambios de cualquier modulo.
 */
export interface RES_CambiosLog {
  id_empleado: number; // el que hizo el cambio
  nombre_empleado?: string | null; // nombre de quien hizo el cambio, opcional
  motivo: string | null; // motivo del cambio, opcional
  update_at: string; // fecha y hora del cambio
  // Al editar
  cambios: {
    campo_bd: string | null;
    campo: string | null;
    valor_anterior: unknown;
    valor_nuevo: unknown;
  }[];
}
