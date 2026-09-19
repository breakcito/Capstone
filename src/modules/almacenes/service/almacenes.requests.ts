import { z } from "zod";

/**
 * Crear almacen (logistica o carbon).
 *
 * - `para_carbon`: lo establece el formulario (logistica=false, carbon=true).
 * - `es_principal`: solo aplica a logistica. El backend lo ignora si
 *   `para_carbon=true` para no romper la regla de negocio.
 * - Ubicacion geografica: opcional para ambos modos.
 */
export const Schema_CrearAlmacen = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  descripcion: z.string().optional(),
  es_principal: z.boolean().default(false),
  para_carbon: z.boolean().default(false),
  direccion: z.string().optional().nullable(),
  id_departamento: z.number().int().positive().optional().nullable(),
  id_provincia: z.number().int().positive().optional().nullable(),
  id_distrito: z.number().int().positive().optional().nullable(),
});

export type DTO_CrearAlmacen = z.infer<typeof Schema_CrearAlmacen>;

//

export const Schema_NuevoResponsable = z.object({
  id_almacen: z.number().int().positive(),
  id_empleado: z.number().int().positive("Seleccione un empleado"),
  fecha_inicio: z.string().min(1, "La fecha de inicio es requerida"),
});

export type DTO_NuevoResponsable = z.infer<typeof Schema_NuevoResponsable>;