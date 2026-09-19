import { Periodo } from "../enums/_generic/periodo";

export function getDuracionPeriodo(
  tiempo: number | string,
  periodo: Periodo,
  periodoRespuesta: Periodo = Periodo.Diario,
): number {
  // 1. Conversión y saneamiento del input
  const tiempoNumerico = Number(tiempo);

  // Si el string estaba vacío o contenía letras, Number() devuelve NaN.
  // Lo interceptamos para evitar que rompa la vista.
  if (isNaN(tiempoNumerico)) {
    return 0;
  }

  // 2. Diccionario de equivalencias
  const diasPorPeriodo: Record<Periodo, number> = {
    [Periodo.Diario]: 1,
    [Periodo.Semanal]: 7,
    [Periodo.Mensual]: 30,
    [Periodo.Anual]: 365,
    [Periodo.Ninguno]: 0,
  };

  const factorOrigen = diasPorPeriodo[periodo];
  const factorDestino = diasPorPeriodo[periodoRespuesta];

  // 3. Control de división por cero
  if (factorDestino === 0) {
    return 0;
  }

  // 4. Cálculo matemático
  return (tiempoNumerico * factorOrigen) / factorDestino;
}
