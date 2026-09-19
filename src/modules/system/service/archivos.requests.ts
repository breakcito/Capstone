import { z } from "zod";

export const Schema_RenameArchivo = z.object({
  carpeta: z.string().min(1),
  old: z.string().min(1),
  new: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9._\-]+$/, "Nombre invalido"),
});

export type DTO_RenameArchivo = z.infer<typeof Schema_RenameArchivo>;
