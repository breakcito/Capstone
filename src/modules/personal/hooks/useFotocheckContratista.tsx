import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";

import type { RES_ContratistaResumen } from "../service/empleados.responses";
import { useNotify } from "../../../hooks/useNotify";
import { usePrint } from "../../../hooks/usePrint";
import { ArchivoService } from "../../../service/archivo.service";
import {
  FotocheckPDF,
  type FotocheckData,
} from "../../../presentation/utils/fotocheck-pdf";

interface UseFotocheckContratistaArgs {
  contratistas: RES_ContratistaResumen[];
}

const getBase64ImageWithAuth = async (
  url: string | null | undefined,
): Promise<string | null> => {
  if (!url) return null;
  if (url.startsWith("data:")) return url;

  const blobToDataUrl = (blob: Blob): Promise<string | null> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string) ?? null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });

  try {
    let blob: Blob | null = null;
    if (url.includes("/storage/")) {
      // Imagen del storage local: probar varios paths porque Laravel puede
      // tener el archivo bajo storage/, public/ o storage/app/public/.
      const pathRelativo = url.substring(
        url.indexOf("/storage/") + "/storage/".length,
      );
      const candidates = [
        pathRelativo,
        `storage/${pathRelativo}`,
        `public/${pathRelativo}`,
        `storage/app/public/${pathRelativo}`,
      ];
      for (const path of candidates) {
        try {
          const b = await ArchivoService.descargarArchivo(path, "imagen");
          if (b && b.type.startsWith("image/")) {
            blob = b;
            break;
          }
        } catch {
          // intentar el siguiente
        }
      }
    } else if (url.startsWith("http://") || url.startsWith("https://")) {
      // URL externa (CDN, S3, etc.): pasar por el proxy del backend para
      // evitar el preflight CORS en el navegador.
      blob = await ArchivoService.descargarExterno(url);
    }

    if (blob && blob.type.startsWith("image/")) {
      return await blobToDataUrl(blob);
    }
    return null;
  } catch {
    return null;
  }
};


/**
 * Hook para generar y descargar fotochecks de CONTRATISTAS en PDF
 * (1 PDF multi-página, 1 página por contratista).
 *
 * A diferencia del de empleados, los contratistas NO tienen cargo, área
 * ni empresa. El fotocheck muestra en su lugar:
 *  - Mina donde trabaja
 *  - Primera labor asignada (o la única si solo tiene una)
 */
export const useFotocheckContratista = ({
  contratistas,
}: UseFotocheckContratistaArgs) => {
  const { notifyError, notifySuccess } = useNotify();
  const { print, prepare } = usePrint();
  const [generando, setGenerando] = useState(false);
  const [qrDataUrls, setQrDataUrls] = useState<Record<number, string>>({});

  // Genera los QR data URLs de cada contratista.
  useEffect(() => {
    let cancelado = false;
    const generarQrs = async () => {
      const nuevosQr: Record<number, string> = {};
      for (const c of contratistas) {
        if (!c.qr_token) continue;
        try {
          const dataUrl = await QRCode.toDataURL(c.qr_token, {
            width: 320,
            margin: 1,
            errorCorrectionLevel: "M",
          });
          nuevosQr[c.id_contratista] = dataUrl;
        } catch {
          // No interrumpe el flujo si un QR falla.
        }
      }
      if (!cancelado) setQrDataUrls(nuevosQr);
    };
    if (contratistas.length > 0) {
      void generarQrs();
    } else {
      setQrDataUrls({});
    }
    return () => {
      cancelado = true;
    };
  }, [contratistas]);

  /**
   * Convierte un RES_ContratistaResumen a FotocheckData.
   * - tipo: "contratista"
   * - mina: nombre de la mina
   * - labor: primera labor asignada (o null)
   * - cargo, area, empresa, empresaUrlLogo: null
   */
  const buildFotocheckData = useCallback(
    (c: RES_ContratistaResumen, qrDataUrl: string): FotocheckData => {
      const primeraLabor =
        c.labores_asignadas && c.labores_asignadas.length > 0
          ? c.labores_asignadas[0]?.nombre ?? null
          : null;

      return {
        tipo: "contratista",
        nombre: c.nombre,
        apellido: c.apellido,
        cargo: null,
        area: null,
        empresa: null,
        empresaUrlLogo: null,
        mina: c.mina ?? null,
        labor: primeraLabor,
        urlFoto: c.url_foto ?? null,
        qrDataUrl,
        qrToken: c.qr_token,
        dni: c.dni,
        ancho: 400,
        alto: 600,
      };
    },
    [],
  );

  const descargar = useCallback(
    async (ancho: number, alto: number) => {
      if (contratistas.length === 0) {
        notifyError("No hay contratistas seleccionados para generar fotochecks");
        return;
      }

      const targetName = `PrinterFotocheckCon_${Date.now()}`;
      const printerWindow = prepare(targetName);

      setGenerando(true);
      try {
        const qrList: Record<number, string> = { ...qrDataUrls };
        for (const c of contratistas) {
          if (!qrList[c.id_contratista] && c.qr_token) {
            try {
              qrList[c.id_contratista] = await QRCode.toDataURL(c.qr_token, {
                width: 320,
                margin: 1,
                errorCorrectionLevel: "M",
              });
            } catch {
              // continuar
            }
          }
        }

        const fotochecks: FotocheckData[] = await Promise.all(
          contratistas.map(async (c) => {
            const qr = qrList[c.id_contratista] ?? "";
            const fotoBase64 = await getBase64ImageWithAuth(c.url_foto);
            const fData = buildFotocheckData(c, qr);
            fData.urlFoto = fotoBase64 || undefined;
            return fData;
          }),
        );

        fotochecks.forEach((f) => {
          f.ancho = ancho;
          f.alto = alto;
        });

        print(<FotocheckPDF fotochecks={fotochecks} />, {
          documentTitle: "Fotochecks - Contratistas",
          target: targetName,
        });
        notifySuccess("Fotocheck PDF generado correctamente");
      } catch (err) {
        console.error(err);
        notifyError("Error al generar el PDF de fotochecks");
        printerWindow?.close();
      } finally {
        setGenerando(false);
      }
    },
    [contratistas, qrDataUrls, print, prepare, buildFotocheckData, notifyError, notifySuccess],
  );

  return {
    generando,
    qrDataUrls,
    descargar,
  };
};