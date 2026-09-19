import { z } from "zod";

export const PermisoNodo = z.object({
  tipo: z.enum(["menu", "submenu", "modulo"]),
  id: z.number().int().positive(),
});

export const Schema_RegistroRol = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(64, "El nombre es demasiado largo"),
  descripcion: z
    .string()
    .max(512, "La descripción es demasiado larga")
    .optional(),
  permisos: z
    .array(PermisoNodo)
    .min(1, "Debe seleccionar al menos un permiso"),
});

export type DTO_RegistroRol = z.infer<typeof Schema_RegistroRol>;
