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
  Pendiente = "Pendiente",
  Rechazado = "Rechazado",
  Aprobado = "Aprobado",
  EsperandoAprobacion = "Pendiente",
  AprobadoLogistica = "Aprobado",
  EnDespacho = "En Despacho",
  Cerrado = "Cerrado",
  Completado = "Completado",
}

export enum Estado_RequerimientoDetalleLog {
  EsperandoAprobacion = "Esperando Aprobacion",
  ConsultaLogistica = "Consulta Logistica",
  Aprobado = "Aprobado",
  EnDespacho = "En Despacho",
  NuevaEntrega = "Nueva Entrega",
  Rechazado = "Rechazado",
  Completado = "Completado",
  Cerrado = "Cerrado",
}