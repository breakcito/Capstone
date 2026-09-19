import { z } from "zod";
import { Genero } from "../../../shared/enums/_generic/genero";

const documentoTransform = (val: string | null | undefined) =>
  val === "" ? null : val;

const fechaTransform = (val: unknown) => {
  if (!val) return null;
  if (val instanceof Date) return val.toISOString().split("T")[0];
  return val as string;
};

// Regex pragmático de email — valida solo si hay valor
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Schema_CrearEmpleado = z
  .object({
    nombre: z.string().min(1, "Los nombres son obligatorios"),
    apellido: z.string().min(1, "Los apellidos son obligatorios"),
    genero: z
      .nativeEnum(Genero, {
        message: "Seleccione un género válido",
      })
      .nullable()
      .optional(),
    dni: z
      .string()
      .optional()
      .nullable()
      .transform(documentoTransform)
      .refine((val) => !val || /^\d{8}$/.test(val), {
        message: "El DNI debe tener exactamente 8 dígitos",
      }),
    ruc: z
      .string()
      .optional()
      .nullable()
      .transform(documentoTransform)
      .refine((val) => !val || /^\d{11}$/.test(val), {
        message: "El RUC debe tener exactamente 11 dígitos",
      }),
    carnet_extranjeria: z
      .string()
      .optional()
      .nullable()
      .transform(documentoTransform),
    pasaporte: z
      .string()
      .optional()
      .nullable()
      .transform(documentoTransform),
    fecha_nacimiento: z.any().optional().nullable().transform(fechaTransform),
    con_contrato: z.boolean().optional().default(false),
    direccion: z
      .string()
      .max(255, "La dirección no debe exceder los 255 caracteres")
      .optional()
      .nullable()
      .transform(documentoTransform),
    telefono: z
      .string()
      .max(32, "El teléfono no debe exceder los 32 caracteres")
      .optional()
      .nullable()
      .transform(documentoTransform),
    email: z
      .string()
      .max(128, "El email no debe exceder los 128 caracteres")
      .optional()
      .nullable()
      .transform(documentoTransform)
      .refine((val) => !val || emailRegex.test(val), {
        message: "Ingrese un email válido",
      }),
    foto: z.any().nullable().optional(),
    id_cargo: z.number().nullable().optional(),
    id_empresa: z.number().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    // Si NO tiene contrato, id_cargo es obligatorio
    if (!data.con_contrato && (!data.id_cargo || data.id_cargo < 1)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["id_cargo"],
        message: "Debe seleccionar un cargo",
      });
    }
    // Si NO tiene contrato, id_empresa también es obligatorio
    if (!data.con_contrato && (!data.id_empresa || data.id_empresa < 1)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["id_empresa"],
        message: "Debe seleccionar una empresa",
      });
    }
  });

export type DTO_CrearEmpleado = z.infer<typeof Schema_CrearEmpleado>;

/**
 * Schema de edición.
 *
 * - Campos personales y de contacto: siempre requeridos/permitidos.
 * - `id_cargo` y `id_empresa`: opcionales a nivel cliente. El backend
 *   decide: si el empleado TIENE contrato vigente, ignora esos campos;
 *   si NO tiene, los exige. El frontend solo los manda cuando el
 *   usuario los modificó en el modal (siempre que el modal los
 *   muestre — ver `modal-editar-empleado.tsx`).
 *
 * NO se editan: `ruc`, `carnet_extranjeria`, `pasaporte` (no se usan).
 * NO se edita: `con_contrato`, `id_contrato_vigente` (gestionadas por
 * el módulo ContratosEmpleado).
 */
export const Schema_ActualizarEmpleado = z.object({
  nombre: z.string().min(1, "Los nombres son obligatorios"),
  apellido: z.string().min(1, "Los apellidos son obligatorios"),
  genero: z
    .nativeEnum(Genero, {
      message: "Seleccione un género válido",
    })
    .nullable()
    .optional(),
  dni: z
    .string()
    .optional()
    .nullable()
    .transform(documentoTransform)
    .refine((val) => !val || /^\d{8}$/.test(val), {
      message: "El DNI debe tener exactamente 8 dígitos",
    }),
  fecha_nacimiento: z.any().optional().nullable().transform(fechaTransform),
  direccion: z
    .string()
    .max(255, "La dirección no debe exceder los 255 caracteres")
    .optional()
    .nullable()
    .transform(documentoTransform),
  telefono: z
    .string()
    .max(32, "El teléfono no debe exceder los 32 caracteres")
    .optional()
    .nullable()
    .transform(documentoTransform),
  email: z
    .string()
    .max(128, "El email no debe exceder los 128 caracteres")
    .optional()
    .nullable()
    .transform(documentoTransform)
    .refine((val) => !val || emailRegex.test(val), {
      message: "Ingrese un email válido",
    }),
  id_cargo: z.number().nullable().optional(),
  id_empresa: z.number().nullable().optional(),
});

export type DTO_ActualizarEmpleado = z.infer<typeof Schema_ActualizarEmpleado>;

/**
 * Schema de edición para contratista.
 *
 * Solo datos personales + contacto. NO se editan: mina, labores,
 * ruc, carnet_extranjeria, pasaporte, con_contrato, id_contrato_vigente.
 */
export const Schema_ActualizarContratista = z.object({
  nombre: z.string().min(1, "Los nombres son obligatorios"),
  apellido: z.string().min(1, "Los apellidos son obligatorios"),
  genero: z
    .nativeEnum(Genero, {
      message: "Seleccione un género válido",
    })
    .nullable()
    .optional(),
  dni: z
    .string()
    .optional()
    .nullable()
    .transform(documentoTransform)
    .refine((val) => !val || /^\d{8}$/.test(val), {
      message: "El DNI debe tener exactamente 8 dígitos",
    }),
  fecha_nacimiento: z.any().optional().nullable().transform(fechaTransform),
  direccion: z
    .string()
    .max(255, "La dirección no debe exceder los 255 caracteres")
    .optional()
    .nullable()
    .transform(documentoTransform),
  telefono: z
    .string()
    .max(32, "El teléfono no debe exceder los 32 caracteres")
    .optional()
    .nullable()
    .transform(documentoTransform),
  email: z
    .string()
    .max(128, "El email no debe exceder los 128 caracteres")
    .optional()
    .nullable()
    .transform(documentoTransform)
    .refine((val) => !val || emailRegex.test(val), {
      message: "Ingrese un email válido",
    }),
});

export type DTO_ActualizarContratista = z.infer<typeof Schema_ActualizarContratista>;

export const Schema_CrearContratista = z.object({
  nombre: z.string().min(1, "Los nombres son obligatorios"),
  apellido: z.string().min(1, "Los apellidos son obligatorios"),
  genero: z
    .nativeEnum(Genero, {
      message: "Seleccione un género válido",
    })
    .nullable()
    .optional(),
  dni: z
    .string()
    .optional()
    .nullable()
    .transform(documentoTransform)
    .refine((val) => !val || /^\d{8}$/.test(val), {
      message: "El DNI debe tener exactamente 8 dígitos",
    }),
  ruc: z
    .string()
    .optional()
    .nullable()
    .transform(documentoTransform)
    .refine((val) => !val || /^\d{11}$/.test(val), {
      message: "El RUC debe tener exactamente 11 dígitos",
    }),
  carnet_extranjeria: z
    .string()
    .optional()
    .nullable()
    .transform(documentoTransform),
  pasaporte: z
    .string()
    .optional()
    .nullable()
    .transform(documentoTransform),
  fecha_nacimiento: z.any().optional().nullable().transform(fechaTransform),
  direccion: z
    .string()
    .max(255, "La dirección no debe exceder los 255 caracteres")
    .optional()
    .nullable()
    .transform(documentoTransform),
  telefono: z
    .string()
    .max(32, "El teléfono no debe exceder los 32 caracteres")
    .optional()
    .nullable()
    .transform(documentoTransform),
  email: z
    .string()
    .max(128, "El email no debe exceder los 128 caracteres")
    .optional()
    .nullable()
    .transform(documentoTransform)
    .refine((val) => !val || emailRegex.test(val), {
      message: "Ingrese un email válido",
    }),
  foto: z.any().nullable().optional(),
  id_mina: z.number().min(1, "Debe seleccionar una mina"),
  ids_labor: z.array(z.number()).optional().default([]),
  con_contrato: z.boolean().optional().default(false),
});

export type DTO_CrearContratista = z.infer<typeof Schema_CrearContratista>;

export interface DTO_AsignarLaboresContratista {
  id_mina: number;
  ids_labor: number[];
}

export const Schema_CrearCuentaBancariaEmpleado = z.object({
  id_empleado: z.number().min(1, "Seleccione un empleado"),
  id_banco: z.number().min(1, "Seleccione un banco válido"),
  tipo_cuenta_bancaria: z.string().optional().nullable(),
  moneda: z.string().min(1, "Seleccione una moneda"),
  numero_cuenta: z.string().min(1, "El número de cuenta es requerido"),
  cci: z.string().optional().nullable(),
});

export type DTO_CrearCuentaBancariaEmpleado = z.infer<
  typeof Schema_CrearCuentaBancariaEmpleado
>;

export const Schema_ActualizarCuentaBancariaEmpleado = z.object({
  id_banco: z.number().min(1, "Seleccione un banco válido"),
  tipo_cuenta_bancaria: z.string().optional().nullable(),
  moneda: z.string().min(1, "Seleccione una moneda"),
  numero_cuenta: z.string().min(1, "El número de cuenta es requerido"),
  cci: z.string().optional().nullable(),
});

export type DTO_ActualizarCuentaBancariaEmpleado = z.infer<
  typeof Schema_ActualizarCuentaBancariaEmpleado
>;

export const Schema_CrearBanco = z.object({
  nombre: z.string().min(1, "El nombre del banco es requerido"),
  abreviatura: z.string().min(1, "La abreviatura es requerida"),
});
export type CrearBancoRequest = z.infer<typeof Schema_CrearBanco>;
