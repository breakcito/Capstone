import { useState } from "react";
import { usePrint } from "../../../hooks/usePrint";
import { useNotify } from "../../../hooks/useNotify";
import { AtencionService } from "../service/atencion.service";
import { RequerimientoPDF } from "../presentation/requerimiento-pdf";
import type { RES_RequerimientoAlmacen } from "../../../service/responses/requerimientos-almacen/requerimiento-almacen";

export const useImprimirRequerimiento = () => {
  const { prepare, print } = usePrint();
  const { notifyError } = useNotify();
  const [imprimiendo, setImprimiendo] = useState(false);

  const imprimir = async (requerimiento: RES_RequerimientoAlmacen) => {
    // 1. Abrimos la ventana de carga sincrónicamente antes de la promesa
    const targetName = `PrinterReq_${requerimiento.id_requerimiento}`;
    const printerWindow = prepare(targetName);

    setImprimiendo(true);
    try {
      // 2. Traer el detalle de la base de datos
      const res = await AtencionService.obtenerDetallesRequerimiento(
        requerimiento.id_requerimiento,
      );

      if (res.success && res.data) {
        // Formamos la data completa que requiere el PDF
        const fullReq: RES_RequerimientoAlmacen = {
          ...requerimiento,
          detalles: res.data,
        };

        // 3. Ejecutar render del PDF en la ventana ya abierta
        print(<RequerimientoPDF requerimiento={fullReq} />, {
          documentTitle: `Requerimiento_${requerimiento.correlativo}`,
          target: targetName,
        });
      } else {
        notifyError(
          res.message || "No se pudo obtener el detalle para imprimir",
        );
        printerWindow?.close();
      }
    } catch (err) {
      console.error(err);
      notifyError("Ocurrió un error al obtener detalles para impresión");
      printerWindow?.close();
    } finally {
      setImprimiendo(false);
    }
  };

  return { imprimir, imprimiendo };
};
