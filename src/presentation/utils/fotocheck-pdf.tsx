import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { useAuthStore } from "../../stores/auth.store";
import { getPdfAccent } from "./pdf/pdf-theme";

const tw = createTw({});

export interface FotocheckData {
  tipo: "empleado" | "contratista";
  nombre: string;
  apellido: string;
  cargo?: string | null;
  area?: string | null;
  empresa?: string | null;
  empresaUrlLogo?: string | null;
  empresaColorPredominante?: string | null;
  mina?: string | null;
  labor?: string | null;
  urlFoto?: string | null;
  qrDataUrl: string;
  qrToken: string;
  dni?: string | null;
  // Tamaño en píxeles (se convierte a pt en el Page size)
  ancho: number;
  alto: number;
}

const pxToPt = (px: number) => (px * 72) / 96;

const obtenerUrlAbsoluta = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const apiBase = import.meta.env.VITE_API_URL || "";
  const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
  const path = url.startsWith("/") ? url : "/" + url;
  return `${base}${path}`;
};

const resolveImageSrc = (url: string | null | undefined) => {
  if (!url) return undefined;
  const fullUrl = obtenerUrlAbsoluta(url);
  if (!fullUrl) return undefined;

  if (fullUrl.startsWith("data:")) {
    return fullUrl;
  }

  const token = useAuthStore.getState().token;
  return {
    uri: fullUrl,
    method: "GET" as const,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
};

const FotocheckCard = ({ data }: { data: FotocheckData }) => {
  const pageW = pxToPt(data.ancho);
  const pageH = pxToPt(data.alto);
  // Foto del empleado (círculo, dimensión proporcional al tamaño)
  const fotoSize = Math.max(80, Math.min(data.ancho, data.alto) * 0.32);
  // QR (cuadrado en la parte inferior, proporcional)
  const qrSize = Math.max(80, Math.min(data.ancho, data.alto) * 0.28);

  const logoSrc = resolveImageSrc(data.empresaUrlLogo);
  const fotoSrc = resolveImageSrc(data.urlFoto);

  // Color del banner: solo dinámico para empleados con color_predominante;
  // contratistas o sin empresa mantienen el gris/carbón original.
  const bannerColor =
    data.tipo === "empleado" && data.empresaColorPredominante
      ? getPdfAccent(data.empresaColorPredominante)
      : "#37404c";

  return (
    <Page
      size={[pageW, pageH]}
      style={tw("bg-white flex-col items-center relative")}
    >
      {/* Banner superior con fondo neutro y decorativo */}
      <View
        style={{
          width: "100%",
          height: pageH * 0.18,
          backgroundColor: bannerColor,
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Franja decorativa inferior del banner */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: bannerColor,
          }}
        />
      </View>

      {/* Contenido principal centrado */}
      <View style={tw("flex-1 flex-col items-center justify-center w-full px-4")}>
        {/* Foto circular con margen negativo para solapar el banner */}
        <View style={{ marginTop: -(fotoSize * 0.5), zIndex: 10, marginBottom: 8 }}>
          {fotoSrc ? (
            <Image
              src={fotoSrc}
              style={{
                width: fotoSize,
                height: fotoSize,
                borderRadius: 9999,
                border: "3pt solid #fff",
                objectFit: "cover",
              }}
            />
          ) : (
            <View
              style={{
                width: fotoSize,
                height: fotoSize,
                borderRadius: 9999,
                border: "3pt solid #fff",
                backgroundColor: "#e5e7eb",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={tw("text-[20pt] text-zinc-500 font-extrabold")}>
                {data.nombre[0]?.toUpperCase() ?? "?"}
              </Text>
            </View>
          )}
        </View>

        {/* Nombre completo */}
        <Text style={tw("text-[15pt] font-extrabold text-zinc-900 mb-1 text-center")}>
          {data.nombre} {data.apellido}
        </Text>

        {/* Subtítulo: cargo/área para empleados, mina/labor para contratistas */}
        {data.tipo === "empleado" ? (
          <View style={tw("items-center mb-1")}>
            {data.cargo && (
              <Text style={tw("text-[12pt] font-extrabold text-zinc-800 text-center")}>
                {data.cargo}
              </Text>
            )}
            {data.area && (
              <Text style={tw("text-[9pt] font-semibold text-zinc-500 mt-0.5 text-center")}>
                {data.area}
              </Text>
            )}
          </View>
        ) : (
          <View style={tw("items-center mb-1")}>
            {data.mina && (
              <Text style={tw("text-[12pt] font-extrabold text-zinc-800 text-center")}>
                Mina: {data.mina}
              </Text>
            )}
            {data.labor && (
              <Text style={tw("text-[9pt] font-semibold text-zinc-500 mt-0.5 text-center")}>
                Labor: {data.labor}
              </Text>
            )}
          </View>
        )}

        {/* DNI opcional */}
        {data.dni && (
          <Text style={tw("text-[8pt] text-zinc-500 mb-2")}>
            DNI: {data.dni}
          </Text>
        )}

        {/* QR al final */}
        <View
          style={{
            marginTop: 4,
            padding: 4,
            backgroundColor: "#fff",
            borderRadius: 6,
            border: "1pt solid #e5e7eb",
          }}
        >
          <Image
            src={data.qrDataUrl}
            style={{ width: qrSize, height: qrSize }}
          />
        </View>

        {/* qr_token monoespaciado pequeño */}
        <Text style={tw("text-[6pt] text-zinc-400 mt-1")}>
          {data.qrToken}
        </Text>

        {/* Empresa y Logo al final de todo (en una fila) */}
        {data.tipo === "empleado" && (
          <View style={[tw("flex-row items-center justify-center mt-3 px-4"), { gap: 6 }]}>
            {logoSrc && (
              <Image
                src={logoSrc}
                style={{
                  width: 35,
                  height: 20,
                  objectFit: "contain",
                }}
              />
            )}
            {data.empresa && (
              <Text style={tw("text-[7.5pt] font-extrabold text-zinc-500 max-w-[85%]")}>
                {data.empresa}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Banda decorativa inferior */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: bannerColor,
        }}
      />
    </Page>
  );
};

export const FotocheckPDF = ({ fotochecks }: { fotochecks: FotocheckData[] }) => {
  return (
    <Document>
      {fotochecks.map((c, i) => (
        <FotocheckCard key={`fotocheck-${i}-${c.qrToken}`} data={c} />
      ))}
    </Document>
  );
};
