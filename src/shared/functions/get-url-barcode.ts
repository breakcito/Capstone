import JsBarcode from "jsbarcode";

/**
 * Genera un DataURL (Base64) de un código de barras. Funcion
 * reutilizable desde componentes de React pero sobre todo para ser
 * utilizados dentro de componentes de pdf hechos con @react-pdf/renderer
 */
export const get_url_barcode = (
  value: string,
  options?: JsBarcode.BaseOptions,
): string => {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, value, {
    format: "CODE128",
    displayValue: false,
    fontSize: 18,
    margin: 0,
    ...options,
  });
  return canvas.toDataURL("image/png");
};
