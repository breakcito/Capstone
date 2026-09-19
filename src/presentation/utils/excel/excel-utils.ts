import type ExcelJS from "exceljs";

export type ExcelBuilderFn = (
  workbook: ExcelJS.Workbook,
) => Promise<void> | void;

/**
 * Procesa un Workbook de exceljs y desencadena la descarga en el navegador de forma invisible.
 *
 * @param workbook La instancia de ExcelJS.Workbook ya construida
 * @param filename El nombre con el que se descargará el archivo (sin o con extensión .xlsx)
 */
export const downloadWorkbook = async (
  workbook: ExcelJS.Workbook,
  filename: string,
) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  // Asegurar que el filename termine en .xlsx
  const finalFilename = filename.endsWith(".xlsx")
    ? filename
    : `${filename}.xlsx`;
  a.download = finalFilename;

  a.style.display = "none";
  document.body.appendChild(a);
  a.click();

  // Limpieza
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
};
