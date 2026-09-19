import { z } from "zod";

export const Schema_Nodo = z.object({
  nombre: z.string().min(2).max(64),
  // path puede ser null para nodos desplegables (contenedores sin vista propia)
  path: z.string().min(1).max(128).nullable(),
  numero_orden: z.number().int().min(0),
  es_desplegable: z.boolean().optional(),
});

export type DTO_Nodo = z.infer<typeof Schema_Nodo>;

export const Schema_Modulo = z.object({
  id_submenu: z.number().int().positive(),
  nombre: z.string().min(2).max(64),
  path: z.string().min(1).max(128).nullable(),
  numero_orden: z.number().int().min(0),
});

export type DTO_Modulo = z.infer<typeof Schema_Modulo>;
