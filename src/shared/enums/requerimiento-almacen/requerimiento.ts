export enum Estado_Requerimiento {
  Generado = "Generado",
  EnDespacho = "En Despacho",
  //
  Anulado = "Anulado",
  Cerrado = "Cerrado",
  //
  Completado = "Completado",
}

/**
 * Estados posibles de un DETALLE del requerimiento (`requerimiento_almacen_detalle`).
 *
 * NOTA: Aunque los nombres `EsperandoAprobacion` y `AprobadoLogistica` se
 * mantienen por compatibilidad con el codigo existente del modulo de
 * atencion (gestion y trazabilidad), sus valores son alias de `Pendiente`
 * y `Aprobado` respectivamente. La BD actualmente no los usa directamente,
 * pero la UI puede compararlos por nombre.
 */
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

/**
 * Estados posibles de una ENTREGA (cabecera `requerimiento_almacen_entrega`).
 * La cabecera nace como "Entregado" y, si se anula, pasa a "Anulado".
 */
export enum Estado_RequerimientoEntrega {
  Entregado = "Entregado",
  Anulado = "Anulado",
}