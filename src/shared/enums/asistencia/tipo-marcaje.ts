export enum TipoMarcaje {
  Ingreso = "Ingreso",
  Salida = "Salida",
  // Un valor null en la columna `tipo_marcaje` significa que el proceso
  // no llegó a completarse (por timeout, cancelación o error).
}