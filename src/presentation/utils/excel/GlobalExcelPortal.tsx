import { useEffect } from "react";
import { useExcelStore, type ExcelJob } from "../../../stores/excel.store";
import { downloadWorkbook } from "./excel-utils";
import { useNotify } from "../../../hooks/useNotify";

const ExcelJobRunner = ({ job }: { job: ExcelJob }) => {
  const dequeueJob = useExcelStore((s) => s.dequeueJob);
  const { notifySuccess, notifyError } = useNotify();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const ExcelJS = (await import("exceljs")).default;
        const workbook = new ExcelJS.Workbook();

        workbook.creator = "BlackSilver ERP";
        workbook.created = new Date();

        await job.config.builder(workbook);
        if (cancelled) return;

        await downloadWorkbook(workbook, job.config.filename);

        notifySuccess("Excel generado y descargado exitosamente.");
        job.config.onSuccess?.();
      } catch (err) {
        console.error("Error al generar el Excel:", err);
        notifyError("Ocurrió un error al construir o descargar el Excel.");
        job.config.onError?.(err as Error);
      } finally {
        if (!cancelled) {
          dequeueJob(job.id);
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

/** Montar una sola vez en AuthLayout. Procesa la cola de trabajos de exportación a Excel. */
export const GlobalExcelPortal = () => {
  const jobs = useExcelStore((s) => s.jobs);
  return (
    <>
      {jobs.map((job) => (
        <ExcelJobRunner key={job.id} job={job} />
      ))}
    </>
  );
};
