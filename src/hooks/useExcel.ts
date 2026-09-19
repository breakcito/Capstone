import { useExcelStore, type ExcelConfig } from "../stores/excel.store";

export const useExcel = () => {
  const enqueueJob = useExcelStore((s) => s.enqueueJob);
  const isGeneratingExcel = useExcelStore((s) => s.jobs.length > 0);

  return {
    isGeneratingExcel,
    generateExcel: (config: ExcelConfig) => {
      enqueueJob(config);
    },
  };
};
