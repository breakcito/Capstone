export interface ValidarLoteOrigenProps {
  lote_id_orden_compra?: number | null;
  lote_id_orden_compra_detalle?: number | null;
  lote_serie_factura?: string | null;
  lote_numero_factura?: string | null;
  lote_costo_por_unidad?: number | null;
  id_lote_producto?: number | null;
  lote_id_orden_compra_comprobante?: number | null;
}

export interface ValidarLoteTargetProps {
  id_orden_compra?: number | null;
  id_orden_compra_detalle?: number | null;
  serie_factura_compra?: string | null;
  numero_factura_compra?: string | null;
  costo_por_unidad?: number | null;
  id_orden_compra_comprobante?: number | null;
}

export interface ValidarLoteOCProps {
  id_orden_compra?: number | null;
  serie_factura_compra?: string | null;
  numero_factura_compra?: string | null;
  precio_unitario?: number | null;
}

/**
 * Valida de forma cliente-side si es compatible ajustar el stock de un lote destino existente (loteTarget).
 * Retorna true si es compatible, false si no.
 *
 * @param loteTarget Datos del lote destino seleccionado en la grilla para ajustar stock.
 * @param loteOrigen Datos del lote de origen asociado al detalle de la entrega despachada.
 * @param ocDatos Datos de la Orden de Compra (para Recepción OC directa).
 */
export function validarAjusteLoteClient(
  loteTarget: ValidarLoteTargetProps,
  loteOrigen?: ValidarLoteOrigenProps | null,
  ocDatos?: ValidarLoteOCProps | null
): boolean {
  // Caso A: Si proviene de otro lote interno (reabastecimiento, préstamo, reposición, transferencia)
  if (loteOrigen) {
    // Si el detalle de entrega original no tiene lote de origen (lote de salida es nulo), se permite cualquier lote destino
    if (loteOrigen.id_lote_producto === null || loteOrigen.id_lote_producto === undefined || loteOrigen.id_lote_producto === 0) {
      return true;
    }

    // 1. Misma orden de compra
    let mismoPO = false;
    if (loteTarget.id_orden_compra && loteOrigen.lote_id_orden_compra) {
      if (Number(loteTarget.id_orden_compra) === Number(loteOrigen.lote_id_orden_compra)) {
        mismoPO = true;
      }
    }

    // 2. Mismo comprobante de sistema
    let mismoComprobante = false;
    if (loteTarget.id_orden_compra_comprobante && loteOrigen.lote_id_orden_compra_comprobante) {
      if (Number(loteTarget.id_orden_compra_comprobante) === Number(loteOrigen.lote_id_orden_compra_comprobante)) {
        mismoComprobante = true;
      }
    }

    // 3. Misma factura (manual o resuelta)
    let mismaFactura = false;
    const serieT = loteTarget.serie_factura_compra?.trim().toLowerCase() || "";
    const numT = loteTarget.numero_factura_compra?.trim() || "";
    const serieO = loteOrigen.lote_serie_factura?.trim().toLowerCase() || "";
    const numO = loteOrigen.lote_numero_factura?.trim() || "";

    if (serieT && serieO && numT && numO) {
      if (serieT === serieO && numT === numO) {
        mismaFactura = true;
      }
    }

    return mismoPO || mismoComprobante || mismaFactura;
  }

  // Caso B: Si proviene directamente de una Orden de Compra externa (Recepción OC)
  if (ocDatos) {
    let mismoPO = false;
    if (loteTarget.id_orden_compra && ocDatos.id_orden_compra) {
      if (Number(loteTarget.id_orden_compra) === Number(ocDatos.id_orden_compra)) {
        mismoPO = true;
      }
    }

    let mismaFactura = false;
    const serieT = loteTarget.serie_factura_compra?.trim().toLowerCase() || "";
    const numT = loteTarget.numero_factura_compra?.trim() || "";
    const serieOC = ocDatos.serie_factura_compra?.trim().toLowerCase() || "";
    const numOC = ocDatos.numero_factura_compra?.trim() || "";

    if (serieT && serieOC && numT && numOC) {
      if (serieT === serieOC && numT === numOC) {
        mismaFactura = true;
      }
    }

    return mismoPO || mismaFactura;
  }

  return true;
}
