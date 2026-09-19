/**
 * Formatea un número agregando comas cada 3 dígitos
 * y eliminando ceros decimales innecesarios a la derecha.
 */
export function formatNumber(
  value: number | string,
  decimals: number = 2,
): string {
  // 1. Convertimos a número en caso de que el valor venga como string
  const num = typeof value === "string" ? parseFloat(value) : value;

  // 2. Validamos que el resultado sea un número real para evitar errores (NaN)
  if (isNaN(num)) {
    return "0";
  }

  // 3. Aplicamos el formato nativo
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0, // No fuerza ceros innecesarios (ej. 10.00 -> 10)
    maximumFractionDigits: decimals, // Límite máximo de decimales permitidos (puedes ajustarlo)
  }).format(num);
}
