import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { createTw } from "react-pdf-tailwind";
import { mmToPt } from "../../shared/functions/mm-to-pt";
import type { RES_TicketLote } from "../../service/responses/lote-producto";

// Configuración de Tailwind para react-pdf
const tw = createTw({});

export interface TicketData extends RES_TicketLote {
  qrDataUrl: string;
}

/** * CONFIGURACIÓN DE MEDIDAS FÍSICAS (Etiqueta 58x28mm) */
const PAGE_W = mmToPt(58);
const PAGE_H = mmToPt(28);

const TicketCard = ({ data }: { data: TicketData }) => (
  <View
    style={tw(
      "flex-1 p-1 justify-center border border-dashed border-zinc-400 rounded-lg",
    )}
  >
    <View style={tw("w-full flex-row items-start gap-2")}>
      {/* QR a la izquierda */}
      <Image
        src={data.qrDataUrl}
        style={{ width: mmToPt(19), height: mmToPt(19) }}
      />

      {/* Columna de detalles a la derecha */}
      <View style={tw("flex-1 gap-px")}>
        <Text style={tw("text-[8.5pt] font-bold text-zinc-950 uppercase mb-1")}>
          {data.almacen}
        </Text>

        <View style={tw("flex-row flex-wrap gap-1")}>
          <Text style={tw("text-[7pt] font-bold text-zinc-700")}>
            Producto:
          </Text>
          <Text style={tw("text-[7pt] text-zinc-700")}>{data.producto}</Text>
        </View>

        <View style={tw("flex-row flex-wrap gap-1")}>
          <Text style={tw("text-[7pt] font-bold text-zinc-700")}>Lote:</Text>
          <Text style={tw("text-[7pt] text-zinc-700")}>{data.lote}</Text>
        </View>

        <View style={tw("flex-row flex-wrap gap-1")}>
          <Text style={tw("text-[7pt] font-bold text-zinc-700")}>Ingreso:</Text>
          <Text style={tw("text-[7pt] text-zinc-700")}>
            {dayjs(data.fecha_ingreso).format("DD/MM/YYYY")}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

export const TicketLotePDF = ({ tickets }: { tickets: TicketData[] }) => (
  <Document>
    {tickets.map((t) => (
      <Page
        key={t.id}
        size={[PAGE_W, PAGE_H]}
        style={tw("bg-white justify-center")}
      >
        <TicketCard data={t} />
      </Page>
    ))}
  </Document>
);
