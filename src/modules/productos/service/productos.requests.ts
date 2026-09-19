import { z } from "zod";
import { TipoProducto } from "../../../shared/enums/_generic/tipo-producto";

export const Schema_CrearProducto = z
  .object({
    id_unidad_medida_base: z
      .number()
      .min(1, "Debe seleccionar una unidad de medida"),
    nombre: z
      .string()
      .min(1, "El nombre es requerido")
      .max(128, "Máximo 128 caracteres"),
    tipo_producto: z.nativeEnum(TipoProducto).default(TipoProducto.Otros),
    es_perecible: z.boolean(),
    stock_minimo_base: z.number().min(0, "Mínimo 0").default(0),
    tiempo_espera_vencimiento: z.number().nullable().optional(),
    periodo_espera_vencimiento: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.es_perecible) {
        return (
          data.tiempo_espera_vencimiento != null &&
          data.tiempo_espera_vencimiento > 0 &&
          data.periodo_espera_vencimiento != null &&
          data.periodo_espera_vencimiento.trim() !== ""
        );
      }
      return true;
    },
    {
      message: "Debe ingresar el tiempo y periodo para productos perecibles",
      path: ["tiempo_espera_vencimiento"],
    },
  );

export type DTO_CrearProducto = z.infer<typeof Schema_CrearProducto>;

export const Schema_ActualizarProducto = z
  .object({
    id_unidad_medida_base: z
      .number()
      .min(1, "Debe seleccionar una unidad de medida"),
    nombre: z
      .string()
      .min(1, "El nombre es requerido")
      .max(128, "Máximo 128 caracteres"),
    tipo_producto: z.nativeEnum(TipoProducto).default(TipoProducto.Otros),
    es_perecible: z.boolean(),
    stock_minimo_base: z.number().min(0, "Mínimo 0").default(0),
    tiempo_espera_vencimiento: z.number().nullable().optional(),
    periodo_espera_vencimiento: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.es_perecible) {
        return (
          data.tiempo_espera_vencimiento != null &&
          data.tiempo_espera_vencimiento > 0 &&
          data.periodo_espera_vencimiento != null &&
          data.periodo_espera_vencimiento.trim() !== ""
        );
      }
      return true;
    },
    {
      message: "Debe ingresar el tiempo y periodo para productos perecibles",
      path: ["tiempo_espera_vencimiento"],
    },
  );

export type DTO_ActualizarProducto = z.infer<typeof Schema_ActualizarProducto>;
