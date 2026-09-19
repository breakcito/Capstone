import { z } from "zod";

export const Schema_UnidadMedida = z.object({
  nombre: z.string().min(2).max(64),
  abreviatura: z.string().min(1).max(8),
});

export type DTO_UnidadMedida = z.infer<typeof Schema_UnidadMedida>;
