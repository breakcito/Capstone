import dayjs from "dayjs";

/**
 * Genera el código interno de un lote de mineral a partir del prefijo de la labor
 * y la fecha de inicio de producción.
 *
 * Formato: <Prefijo>-<DD><MM><AA>
 * Ejemplo: SB-200526  (Labor "San Blas", fecha 20/05/2026)
 *
 * @param prefijo       - Prefijo de la labor (ej. "SB")
 * @param fechaInicio   - Fecha de inicio de producción (Date | string)
 * @returns Código interno generado (string)
 */
export const generarCodigoLoteMineral = (
  prefijo: string,
  fechaInicio: Date | string,
): string => {
  const fecha = dayjs(fechaInicio);
  const dia = fecha.format("DD");
  const mes = fecha.format("MM");
  const anio = fecha.format("YY");
  return `${prefijo.toUpperCase()}-${dia}${mes}${anio}`;
};
