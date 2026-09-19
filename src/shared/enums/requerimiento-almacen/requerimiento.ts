export enum Estado_Requerimiento {
  Generado = "Generado",
  EnDespacho = "En Despacho",
  //
  Anulado = "Anulado",
  Cerrado = "Cerrado",
  //
  Completado = "Completado",
}

export enum Estado_RequerimientoDetalle {
  EsperandoAprobacion = "Esperando Aprobación",
  Rechazado = "Rechazado",
  Aprobado = "Aprobado",
  //
  ConsultaLogistica = "Consultando a Logística",
  RechazadoLogistica = "Rechazado por Logística",
  AprobadoLogistica = "Aprobado por Logística",
  //
  EnDespacho = "En Despacho",
  Cerrado = "Cerrado",
  Completado = "Completado",
}

export enum Estado_RequerimientoDetalleLog {
  EsperandoAprobacion = "Esperando Aprobación",
  Rechazado = "Rechazado",
  Aprobado = "Aprobado",
  //
  ConsultaLogistica = "Consultando a Logística",
  RechazadoLogistica = "Rechazado por Logística",
  AprobadoLogistica = "Aprobado por Logística",
  //
  EnDespacho = "En Despacho",
  //
  Cerrado = "Cerrado",
  Completado = "Completado",
  // ---------------------------
  NuevaEntrega = "Nueva Entrega",
  // ---------------------------
}
