import { Periodo } from "../enums/_generic/periodo";

// funcion que recibe en string el valor del enum Periodo y lo devuelve formateado
export const getNombrePeriodo = (periodo: Periodo): string => {
  switch (periodo) {
    case Periodo.Anual:
      return "Año(s)";
    case Periodo.Mensual:
      return "Mes(es)";
    case Periodo.Diario:
      return "Día(s)";
    case Periodo.Semanal:
      return "Semana(s)";
    default:
      return " - ";
  }
};
