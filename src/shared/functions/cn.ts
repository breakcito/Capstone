import { twMerge } from "tailwind-merge";

/**
 * Utilidad para combinar clases de Tailwind CSS sin conflictos,
 * filtrando valores nulos o indefinidos.
 * Sustituye el uso básico de clsx.
 */
export function cn(
  ...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]
) {
  const classes = inputs
    .flatMap((input) => {
      if (typeof input === "string") return input;
      if (input && typeof input === "object") {
        return Object.entries(input)
          .filter(([, value]) => value)
          .map(([key]) => key);
      }
      return [];
    })
    .filter(Boolean)
    .join(" ");

  return twMerge(classes);
}
