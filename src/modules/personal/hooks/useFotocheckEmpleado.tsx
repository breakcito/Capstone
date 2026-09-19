import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";

import type { RES_EmpleadoResumen } from "../service/empleados.responses";
import { useNotify } from "../../../hooks/useNotify";
import { usePrint } from "../../../hooks/usePrint";
import { ArchivoService } from "../../../service/archivo.service";
import {
  FotocheckPDF,
  type FotocheckData,
} from "../../../presentation/utils/fotocheck-pdf";

interface UseFotocheckEmpleadoArgs {
  empleados: RES_EmpleadoResumen[];
}

const getBase64ImageWithAuth = async (url: string | null | undefined): Promise<string | null> => {
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
 * Hook para generar y descargar fotochecks de empleados en PDF
 * (1 PDF multi-página, 1 página por empleado).
 */
export const useFotocheckEmpleado = ({
  empleados,
}: UseFotocheckEmpleadoArgs) => {
  const { notifyError, notifySuccess } = useNotify();
  const { print, prepare } = usePrint();
  const [generando, setGenerando] = useState(false);
  const [qrDataUrls, setQrDataUrls] = useState<Record<number, string>>({});

  // Genera los QR data URLs de cada empleado.
  useEffect(() => {
    let cancelado = false;
    const generarQrs = async () => {
      const nuevosQr: Record<number, string> = {};
      for (const emp of empleados) {
        if (!emp.qr_token) continue;
        try {
          const dataUrl = await QRCode.toDataURL(emp.qr_token, {
            width: 320,
            margin: 1,
            errorCorrectionLevel: "M",
          });
          nuevosQr[emp.id_empleado] = dataUrl;
        } catch {
          // No interrumpe el flujo si un QR falla.
        }
      }
      if (!cancelado) setQrDataUrls(nuevosQr);
    };
    if (empleados.length > 0) {
      void generarQrs();
    } else {
      setQrDataUrls({});
    }
    return () => {
      cancelado = true;
    };
  }, [empleados]);

  /**
   * Convierte un RES_EmpleadoResumen a FotocheckData.
   * Siempre es tipo "empleado" (el listado excluye contratistas).
   * Las URLs de foto/logo se pasan tal cual (sin fetch ni base64).
   */
  const buildFotocheckData = useCallback(
    (emp: RES_EmpleadoResumen, qrDataUrl: string): FotocheckData => {
      return {
        tipo: "empleado",
        nombre: emp.nombre,
        apellido: emp.apellido,
        cargo: emp.cargo,
        area: emp.area,
        empresa: emp.empresa,
        empresaUrlLogo: emp.empresa_url_logo,
        empresaColorPredominante: emp.color_predominante_empresa,
        mina: null,
        labor: null,
        // URL directa (sin fetch, sin base64).
        urlFoto: emp.url_foto ?? null,
        qrDataUrl,
        qrToken: emp.qr_token,
        dni: emp.dni,
        ancho: 400,
        alto: 600,
      };
    },
    [],
  );

  /**
   * Genera y descarga el PDF con todos los fotochecks.
   * (1 página por empleado, 1 documento PDF con N páginas).
   */
  const descargar = useCallback(
    async (ancho: number, alto: number) => {
      if (empleados.length === 0) {
        notifyError("No hay empleados seleccionados para generar fotochecks");
        return;
      }

      // Pre-abrir la pestaña de impresión synchronously en el click del usuario
      const targetName = `PrinterFotocheck_${Date.now()}`;
      const printerWindow = prepare(targetName);

      setGenerando(true);
      try {
        const qrList: Record<number, string> = { ...qrDataUrls };
        for (const emp of empleados) {
          if (!qrList[emp.id_empleado] && emp.qr_token) {
            try {
              qrList[emp.id_empleado] = await QRCode.toDataURL(emp.qr_token, {
                width: 320,
                margin: 1,
                errorCorrectionLevel: "M",
              });
            } catch {
              // continuar
            }
          }
        }

        // Construye los fotochecks (descarga imágenes con token en base64).
        const fotochecks: FotocheckData[] = await Promise.all(
          empleados.map(async (emp) => {
            const qr = qrList[emp.id_empleado] ?? "";
            const fotoBase64 = await getBase64ImageWithAuth(emp.url_foto);
            const logoBase64 = await getBase64ImageWithAuth(emp.empresa_url_logo);

            const fData = buildFotocheckData(emp, qr);
            fData.urlFoto = fotoBase64 || undefined;
            fData.empresaUrlLogo = logoBase64 || undefined;
            return fData;
          })
        );

        fotochecks.forEach((f) => {
          f.ancho = ancho;
          f.alto = alto;
        });

        print(<FotocheckPDF fotochecks={fotochecks} />, {
          documentTitle: "Fotochecks",
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
    [empleados, qrDataUrls, print, prepare, buildFotocheckData, notifyError, notifySuccess],
  );

  return {
    generando,
    qrDataUrls,
    descargar,
  };
};
