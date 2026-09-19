export enum Estado_Solicitud {
  Generada = "Generada",
  EnDespacho = "En Despacho",
  //
  Anulada = "Anulada",
  Cerrada = "Cerrada",
  //
  Completada = "Completada",
}

export enum Estado_SolicitudDetalle {
  EsperandoAprobacion = "Esperando Aprobación",
  Rechazado = "Rechazado",
  Aprobado = "Aprobado",
  //
  EnDespacho = "En Despacho",
  //
  Cerrado = "Cerrado",
  Completado = "Completado",
  SolicitandoPrestamo = "Solicitando Préstamo",
}

export enum Estado_SolicitudDetalleLog {
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
  SolicitandoPrestamo = "Solicitando Préstamo",
  // ---------------------------
}
