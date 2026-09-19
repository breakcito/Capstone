import type { ReactElement } from "react";
import { usePrinterStore, type PrintConfig } from "../stores/printer.store";
import { preparePrinterWindow } from "../presentation/utils/printer/printer-utils";

/**
 * Encola un <Document> de @react-pdf/renderer para generar
 * un PDF vectorial y abrirlo en nueva pestaña sin diálogo.
 */
export const usePrint = () => {
  const enqueuePrint = usePrinterStore((s) => s.enqueuePrint);

  return {
    print: (document: ReactElement, config?: PrintConfig) => {
      enqueuePrint(document, config);
    },
    /**
     * Pre-abre la ventana de impresión con una pantalla de carga premium.
     * Debe llamarse sincrónicamente en el click del usuario.
     */
    prepare: (target: string = "") => {
      return preparePrinterWindow(target);
    },
  };
};
