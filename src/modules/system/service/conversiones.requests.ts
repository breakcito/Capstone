import { z } from "zod";

export const Schema_Conversion = z
  .object({
    id_unidad_medida_a: z.number().int().positive(),
    id_unidad_medida_b: z.number().int().positive(),
    factor_conversion: z.number().positive(),
  })
  .refine((d) => d.id_unidad_medida_a !== d.id_unidad_medida_b, {
    message: "Las unidades deben ser distintas",
    path: ["id_unidad_medida_b"],
  });

export type DTO_Conversion = z.infer<typeof Schema_Conversion>;
