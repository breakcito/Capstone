import { Document, Page, View, Text } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { createTw } from "react-pdf-tailwind";
import { formatNumber } from "../../../shared/functions/formatNumber";
import { Premura } from "../../../shared/enums/_generic/premura";
import type { RES_RequerimientoAlmacen } from "../../../service/responses/requerimientos-almacen/requerimiento-almacen";

const tw = createTw({});

interface Props {
  requerimiento: RES_RequerimientoAlmacen;
}

export const RequerimientoPDF = ({ requerimiento: req }: Props) => {
  const getPremuraColorBg = (premura: string) => {
    switch (premura) {
      case Premura.Normal:
        return tw("bg-blue-500");
      case Premura.Urgente:
        return tw("bg-orange-500");
      case Premura.Emergencia:
        return tw("bg-red-500");
      default:
        return tw("bg-zinc-500");
    }
  };

  return (
    <Document title={`Requerimiento - ${req.correlativo}`}>
      <Page size="A4" style={tw("p-8 text-[10pt] text-zinc-800 bg-white")}>
        {/* Cabecera Principal */}
        <View
          style={tw(
            "flex-row justify-between items-end border-b pb-2 mb-3 border-zinc-400",
          )}
        >
          <View style={tw("flex-1")}>
            <Text style={tw("text-[12pt] font-bold text-zinc-900")}>
              Almacén {req.almacen_destino}
            </Text>
            <Text style={tw("text-[9pt] text-zinc-600 mt-1")}>
              Requerimiento de Almacén
            </Text>
          </View>
          <View style={tw("items-end")}>
            <Text style={tw("text-[14pt] font-bold text-zinc-900")}>
              N° {req.correlativo}
            </Text>
            <View style={tw("flex-row items-center mt-1")}>
              <Text style={tw("text-[8pt] text-zinc-600")}>
                Generado: {dayjs(req.created_at).format("DD/MM/YYYY HH:mm")}
              </Text>
            </View>
          </View>
        </View>

        {/* Panel de Información Básica */}
        <View style={tw("flex-col bg-zinc-100 p-3 rounded-lg mb-5")}>
          <View style={tw("flex-row")}>
            <View style={tw("flex-1")}>
              {/* Solicitante */}
              <Text
                style={tw("text-[8pt] font-bold text-zinc-500 mb-1 uppercase")}
              >
                Solicitante
              </Text>
              <Text style={tw("text-[10pt] font-bold text-zinc-900")}>
                {req.solicitante ?? "---"}
              </Text>
            </View>

            <View style={tw("flex-1")}>
              {/* Labor */}
              <Text
                style={tw("text-[8pt] font-bold text-zinc-500 mb-1 uppercase")}
              >
                Labor
              </Text>
              {req.labor ? (
                <Text style={tw("text-[10pt] font-bold text-zinc-900")}>
                  {req.labor}
                </Text>
              ) : (
                <Text style={tw("text-[10pt] font-bold text-zinc-900")}>
                  ---
                </Text>
              )}
            </View>

            <View style={tw("flex-1")}>
              {/* fecha de entrega requerida */}
              <Text
                style={tw("text-[8pt] font-bold text-zinc-500 mb-1 uppercase")}
              >
                Fecha Entrega
              </Text>
              <Text
                style={tw(
                  `text-[10pt] font-bold ${
                    req.fecha_entrega_requerida
                      ? "text-zinc-900"
                      : "text-zinc-500"
                  }`,
                )}
              >
                {req.fecha_entrega_requerida
                  ? dayjs(req.fecha_entrega_requerida).format("DD/MM/YYYY")
                  : "No Especificada"}
              </Text>
            </View>
          </View>

          <View style={tw("flex-row mt-4")}>
            <View style={tw("w-1/3")}>
              {/* premura */}
              <Text
                style={tw("text-[8pt] font-bold text-zinc-500 mb-1 uppercase")}
              >
                Prioridad
              </Text>
              <View style={tw("self-start")}>
                <View
                  style={[
                    tw("px-2 py-1 rounded"),
                    getPremuraColorBg(req.premura),
                  ]}
                >
                  <Text style={tw("text-white text-[8pt] font-bold uppercase")}>
                    {req.premura}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* observacion general */}
          {req.observacion && req.observacion.trim() !== "" && (
            <View style={tw("mt-4 pt-3 border-t border-zinc-200")}>
              <Text style={tw("text-[8pt] font-bold text-zinc-500 mb-1")}>
                OBSERVACIONES
              </Text>
              <Text style={tw("text-[9pt] text-zinc-900")}>
                {req.observacion}
              </Text>
            </View>
          )}
        </View>

        {/* Tabla de Artículos */}
        <View style={tw("mt-2 mb-5")}>
          <View style={tw("flex-row bg-zinc-700 py-2 px-1 rounded-t-md")}>
            <Text
              style={tw("w-[5%] text-center text-[9pt] font-bold text-white")}
            >
              #
            </Text>
            <Text
              style={tw(
                "w-[40%] text-left pl-2 text-[9pt] font-bold text-white",
              )}
            >
              DESCRIPCIÓN
            </Text>
            <Text
              style={tw("w-[15%] text-center text-[9pt] font-bold text-white")}
            >
              U.M.
            </Text>
            <Text
              style={tw("w-[15%] text-center text-[9pt] font-bold text-white")}
            >
              CANTIDAD
            </Text>
            <Text
              style={tw("w-[25%] text-left text-[9pt] font-bold text-white")}
            >
              OBSERVACIONES
            </Text>
          </View>

          {req.detalles && req.detalles.length > 0 ? (
            req.detalles.map((det, idx) => {
              const isEquivalent =
                det.id_unidad_medida_base !== det.id_unidad_medida_req;
              return (
                <View
                  key={det.id_requerimiento_almacen_detalle ?? idx}
                  style={tw(
                    "flex-row border-b border-zinc-200 py-2 px-1 items-center",
                  )}
                >
                  <Text
                    style={tw("w-[5%] text-center text-[9pt] text-zinc-500")}
                  >
                    {idx + 1}
                  </Text>

                  <View style={tw("w-[40%] text-left pl-2")}>
                    <Text style={tw("font-bold text-[9pt] text-zinc-900")}>
                      {det.producto}
                    </Text>
                    {isEquivalent && (
                      <Text style={tw("text-[8pt] text-zinc-500 mt-1")}>
                        {formatNumber(det.contenido_por_presentacion)}{" "}
                        {det.unidad_medida_base_abv} x{" "}
                        {det.unidad_medida_req_abv}
                      </Text>
                    )}
                  </View>

                  <Text style={tw("w-[15%] text-center text-[9pt]")}>
                    {det.unidad_medida_req_abv}
                  </Text>

                  <View
                    style={tw(
                      "w-[15%] text-center items-center justify-center",
                    )}
                  >
                    {Number(det.con_magnitud) === 1 &&
                    det.cantidad_items !== null &&
                    det.cantidad_items !== undefined &&
                    det.valor_magnitud !== null &&
                    det.valor_magnitud !== undefined ? (
                      <>
                        <Text style={tw("text-[10pt] font-bold")}>
                          {formatNumber(det.cantidad_solicitada)}{" "}
                          {det.unidad_medida_req_abv}
                        </Text>
                        <Text
                          style={tw(
                            "text-[8pt] text-violet-700 font-semibold mt-0.5",
                          )}
                        >
                          {formatNumber(det.cantidad_items)} ×{" "}
                          {formatNumber(det.valor_magnitud)}{" "}
                          {det.unidad_medida_req_abv} c/u
                        </Text>
                      </>
                    ) : (
                      <Text style={tw("text-[10pt] font-bold")}>
                        {formatNumber(det.cantidad_solicitada)}
                      </Text>
                    )}
                  </View>

                  <View style={tw("w-[25%] text-left")}>
                    <Text style={tw("text-[8pt] text-zinc-500")}>
                      {det.comentario || "---"}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={tw("p-5 items-center")}>
              <Text style={tw("text-[10pt] text-zinc-400 italic")}>
                No se encontraron artículos para este requerimiento.
              </Text>
            </View>
          )}
        </View>

        {/* Zona Inferior: Firmas y Footer (Fijados al fondo) */}
        <View style={tw("absolute bottom-8 left-8 right-8")}>
          {/* Firmas */}
          <View style={tw("flex-row justify-center mb-8 px-10")}>
            <View style={tw("w-[35%] items-center")}>
              <View style={tw("w-full border-b border-zinc-600 mb-1")} />
              <Text style={tw("text-[10pt] font-bold")}>{req.solicitante}</Text>
              <Text style={tw("text-[8pt] text-zinc-500")}>
                FIRMA DEL SOLICITANTE
              </Text>
            </View>
          </View>

          {/* Footer Text */}
          <View
            style={tw(
              "text-center text-zinc-400 text-[8pt] border-t border-zinc-200 pt-2",
            )}
          >
            <Text>
              CONSORCIO MINERO Cupper & Hannia SAC - RUC NRO: 20604004005
            </Text>
            <Text>
              DIRECCION CAL.ASOC/ EL DORADO MZA. F1 A LOTE. 7 APV. EL DORADO
              LIMA - LIMA - PUENTE PIEDRA
            </Text>
            <Text style={tw("mt-1")}>
              Documento impreso el {dayjs().format("DD/MM/YYYY HH:mm")}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
