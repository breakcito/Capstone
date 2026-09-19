/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import { usePrinterStore, type PrintJob } from "../../../stores/printer.store";

const PrintJobRunner = ({ job }: { job: PrintJob }) => {
  const dequeueJob = usePrinterStore((s) => s.dequeueJob);

  useEffect(() => {
    let cancelled = false;
    let win: Window | null = null;
    let revokeFn: (() => void) | null = null;

    const run = async () => {
      try {
        const blob = await pdf(job.document as any).toBlob();
        if (cancelled) return;

        const url = URL.createObjectURL(blob);
        win = window.open(url, job.config.target || "_blank");
        revokeFn = () => URL.revokeObjectURL(url);

        // Liberar el object URL.
        if (win && !job.config.target) {
          win.addEventListener("load", revokeFn, { once: true });
        } else {
          setTimeout(() => {
            if (revokeFn) revokeFn();
          }, 10_000);

          if (!win && !job.config.target) {
            console.warn(
              "Permite ventanas emergentes en este sitio para abrir el PDF.",
            );
          }
        }
      } catch (err) {
        console.error("Error al generar el PDF:", err);
      } finally {
        if (!cancelled) {
          await job.config.onAfterPrint?.();
          dequeueJob(job.id);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
      if (win && revokeFn) {
        win.removeEventListener("load", revokeFn);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

/** Montar una sola vez en AuthLayout. Procesa la cola de trabajos de impresión. */
export const GlobalPrinterPortal = () => {
  const jobs = usePrinterStore((s) => s.jobs);
  return (
    <>
      {jobs.map((job) => (
        <PrintJobRunner key={job.id} job={job} />
      ))}
    </>
  );
};
