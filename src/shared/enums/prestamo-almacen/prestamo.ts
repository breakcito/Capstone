export enum Estado_Prestamo {
  Generado = "Generado",
  EnDespacho = "En Despacho",
  //
  Anulado = "Anulado",
  Cerrado = "Cerrado",
  //
  Completado = "Completado",
}

export enum EstadoReposicion_Prestamo {
  SinReposicion = "Sin Reposicion",
  ReposicionParcial = "Reposicion Parcial",
  ReposicionCompleta = "Reposicion Completa",
}

export enum Estado_PrestamoDetalle {
  EsperandoAprobacion = "Esperando Aprobación",
  Rechazado = "Rechazado",
  Aprobado = "Aprobado",
  //
  EnDespacho = "En Despacho",
  //
  Cerrado = "Cerrado",
  Completado = "Completado",
}

export enum Estado_PrestamoDetalleLog {
  EsperandoAprobacion = "Esperando Aprobación",
  Rechazado = "Rechazado",
  Aprobado = "Aprobado",
  //
  EnDespacho = "En Despacho",
  //
  Cerrado = "Cerrado",
  Completado = "Completado",
  // ---------------------------
  NuevaEntrega = "Nueva Entrega",
  // ---------------------------
}
