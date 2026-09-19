import type ExcelJS from "exceljs";
import dayjs from "dayjs";
import { AtencionService } from "../service/atencion.service";
import type { RES_RequerimientoAlmacen } from "../../../service/responses/requerimientos-almacen/requerimiento-almacen";
import { MESES } from "../../../shared/variables/meses";
import { useNotify } from "../../../hooks/useNotify";

const COLOR_HEADER_BG = "FF1E3A8A";
const COLOR_HEADER_TEXT = "FFFFFFFF";
const COLOR_BORDER = "FFCBD5E1";
const COLOR_CABECERA_BG = "FFEEF2FF";
const COLOR_CABECERA_TEXT = "FF1E1B4B";
const COLOR_AUDITABLE_BG = "FFFEE2E2";
const COLOR_AUDITABLE_TEXT = "FF991B1B";
const COLOR_ROW_ALT = "FFFAFAFA";

const CANTIDAD_HEADERS = [
  "#",
  "Producto",
  "U.M. Solicitada",
  "Cant. Solicitada",
  "U.M. Base",
  "Cant. Base",
  "Progreso",
  "Estado",
  "Comentario",
];

/**
 * Builder del Excel "como en BD" de Requerimientos de Almacén.
 * Estructura: por cada requerimiento, una banda con la cabecera
 * (con celdas combinadas) seguida de los detalles como filas
 * individuales. Separador en blanco entre requerimientos.
 */
export const buildRequerimientosExcel = async (
  workbook: ExcelJS.Workbook,
  requerimientos: RES_RequerimientoAlmacen[],
) => {
  const sheet = workbook.addWorksheet("Requerimientos", {
    views: [{ showGridLines: true, state: "frozen", ySplit: 4 }],
  });

  const COL_WIDTHS = [5, 32, 14, 14, 12, 14, 10, 16, 36];
  sheet.columns = COL_WIDTHS.map((w) => ({ width: w }));

  // Banda superior: título del reporte
  sheet.mergeCells("A1:I2");
  const titleCell = sheet.getCell("A1");
  titleCell.value = "REPORTE DE REQUERIMIENTOS DE ALMACÉN";
  titleCell.font = {
    bold: true,
    size: 16,
    color: { argb: "FF0F172A" },
    name: "Arial",
  };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  let rowIdx = 3;
  // Subtítulo: rango y totales
  const metaRow = sheet.getRow(rowIdx);
  metaRow.getCell(1).value = `Total requerimientos: ${requerimientos.length}`;
  metaRow.getCell(1).font = {
    bold: true,
    size: 10,
    color: { argb: "FF475569" },
    name: "Arial",
  };
  metaRow.getCell(1).alignment = { horizontal: "left" };

  const generatedCell = sheet.getCell(`H${rowIdx}`);
  generatedCell.value = `Generado: ${dayjs().format("DD/MM/YYYY HH:mm")}`;
  generatedCell.font = {
    italic: true,
    size: 9,
    color: { argb: "FF64748B" },
    name: "Arial",
  };
  generatedCell.alignment = { horizontal: "right" };
  sheet.mergeCells(`H${rowIdx}:I${rowIdx}`);

  rowIdx += 1;

  // Cabeceras de las columnas de detalle
  const headerRow = sheet.getRow(rowIdx);
  CANTIDAD_HEADERS.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLOR_HEADER_BG },
    };
    cell.font = {
      bold: true,
      color: { argb: COLOR_HEADER_TEXT },
      size: 10,
      name: "Arial",
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin", color: { argb: COLOR_BORDER } },
      left: { style: "thin", color: { argb: COLOR_BORDER } },
      right: { style: "thin", color: { argb: COLOR_BORDER } },
      bottom: { style: "thin", color: { argb: COLOR_BORDER } },
    };
  });
  headerRow.height = 22;
  rowIdx += 1;

  if (requerimientos.length === 0) {
    sheet.mergeCells(`A${rowIdx}:I${rowIdx + 1}`);
    const empty = sheet.getCell(`A${rowIdx}`);
    empty.value =
      "No hay requerimientos para los filtros seleccionados (mes / año / búsqueda).";
    empty.font = { italic: true, color: { argb: "FF64748B" }, name: "Arial" };
    empty.alignment = { vertical: "middle", horizontal: "center" };
    return;
  }

  // Para cada requerimiento, traer sus detalles y dibujarlos
  let alterna = false;
  for (const req of requerimientos) {
    const startCabeceraRow = rowIdx;
    const cabeceraRow = sheet.getRow(rowIdx);
    cabeceraRow.height = 26;

    const fechaSol = req.fecha_solicitud
      ? dayjs(req.fecha_solicitud).format("DD/MM/YYYY")
      : "—";
    const fechaEnt = req.fecha_entrega_requerida
      ? dayjs(req.fecha_entrega_requerida).format("DD/MM/YYYY")
      : "—";
    const esAuditableTag = req.es_auditable ? "  •  AUDITABLE" : "";

    const cabeceraText =
      `${req.correlativo}  •  Solicitante: ${req.solicitante}` +
      `  •  Labor: ${req.labor || "—"}` +
      `  •  Almacén: ${req.almacen_destino}` +
      `\nF. Solicitud: ${fechaSol}    F. Entrega: ${fechaEnt}` +
      `    Premura: ${req.premura}    Estado: ${req.estado}` +
      (req.observacion ? `    Obs: ${req.observacion}` : "") +
      esAuditableTag;

    sheet.mergeCells(`A${rowIdx}:I${rowIdx}`);
    const cabCell = sheet.getCell(`A${rowIdx}`);
    cabCell.value = cabeceraText;
    cabCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: req.es_auditable ? COLOR_AUDITABLE_BG : COLOR_CABECERA_BG,
      },
    };
    cabCell.font = {
      bold: true,
      size: 10,
      color: {
        argb: req.es_auditable ? COLOR_AUDITABLE_TEXT : COLOR_CABECERA_TEXT,
      },
      name: "Arial",
    };
    cabCell.alignment = {
      vertical: "middle",
      horizontal: "left",
      indent: 1,
      wrapText: true,
    };
    cabCell.border = {
      top: { style: "thin", color: { argb: COLOR_BORDER } },
      left: { style: "thin", color: { argb: COLOR_BORDER } },
      right: { style: "thin", color: { argb: COLOR_BORDER } },
      bottom: { style: "thin", color: { argb: COLOR_BORDER } },
    };
    rowIdx += 1;

    let detalles: Awaited<
      ReturnType<typeof AtencionService.obtenerDetallesRequerimiento>
    >["data"] = [];
    try {
      const resp = await AtencionService.obtenerDetallesRequerimiento(
        req.id_requerimiento,
      );
      if (resp.success && resp.data) {
        detalles = resp.data;
      }
    } catch (err) {
      // Continuar con detalles vacíos para no abortar todo el reporte
      console.error("Error al obtener detalles para Excel", err);
    }

    if (!detalles || detalles.length === 0) {
      const emptyRow = sheet.getRow(rowIdx);
      emptyRow.getCell(1).value = "—";
      emptyRow.getCell(2).value = "Sin detalles registrados";
      sheet.mergeCells(`B${rowIdx}:I${rowIdx}`);
      applyDataRowStyle(emptyRow, COLOR_ROW_ALT, alterna);
      rowIdx += 1;
    } else {
      detalles.forEach((det, idx) => {
        const r = sheet.getRow(rowIdx);
        r.getCell(1).value = idx + 1;
        r.getCell(2).value = det.producto;
        r.getCell(3).value = det.unidad_medida_req_abv;
        r.getCell(4).value = Number(det.cantidad_solicitada || 0);
        r.getCell(5).value = det.unidad_medida_base_abv;
        r.getCell(6).value = Number(det.cantidad_solicitada_base || 0);
        r.getCell(7).value = `${det.porcentaje_progreso || 0}%`;
        r.getCell(8).value = det.estado;
        r.getCell(9).value = det.comentario || "";

        r.getCell(1).alignment = { horizontal: "center" };
        r.getCell(3).alignment = { horizontal: "center" };
        r.getCell(4).alignment = { horizontal: "right" };
        r.getCell(5).alignment = { horizontal: "center" };
        r.getCell(6).alignment = { horizontal: "right" };
        r.getCell(7).alignment = { horizontal: "center" };
        r.getCell(8).alignment = { horizontal: "center" };

        applyDataRowStyle(r, COLOR_ROW_ALT, alterna);
        if (det.es_auditable) {
          r.getCell(2).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFEE2E2" },
          };
          r.getCell(2).font = {
            ...(r.getCell(2).font || {}),
            color: { argb: COLOR_AUDITABLE_TEXT },
            bold: true,
            name: "Arial",
          };
        }
        rowIdx += 1;
      });
    }

    alterna = !alterna;
    // Fila separadora
    rowIdx += 1;
    void startCabeceraRow;
  }
};

const applyDataRowStyle = (
  row: ExcelJS.Row,
  altColor: string,
  alterna: boolean,
) => {
  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.font = cell.font || { name: "Arial", size: 10 };
    cell.font = {
      ...cell.font,
      name: "Arial",
      size: 10,
    };
    if (alterna) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: altColor },
      };
    }
    cell.border = {
      top: { style: "thin", color: { argb: COLOR_BORDER } },
      left: { style: "thin", color: { argb: COLOR_BORDER } },
      right: { style: "thin", color: { argb: COLOR_BORDER } },
      bottom: { style: "thin", color: { argb: COLOR_BORDER } },
    };
  });
};

export interface UseRequerimientosExcelParams {
  requerimientos: RES_RequerimientoAlmacen[];
  mes: string;
  yearcito: string;
}

/**
 * Helper que arma la configuración de useExcel y dispara la generación
 * del Excel. Usado directamente por la página de atención.
 */
export const useRequerimientosExcel = () => {
  const { notifyError } = useNotify();

  const generate = (params: UseRequerimientosExcelParams) => {
    const { requerimientos, mes, yearcito } = params;
    const mesNombre =
      MESES.find((m) => m.value === String(mes))?.label || String(mes);
    const filename = `Requerimientos_Almacen_${mesNombre}_${yearcito}.xlsx`;

    return {
      filename,
      builder: async (workbook: ExcelJS.Workbook) => {
        try {
          await buildRequerimientosExcel(workbook, requerimientos);
        } catch (err) {
          console.error(err);
          notifyError("No se pudo generar el Excel de requerimientos");
          throw err;
        }
      },
    };
  };

  return { generate };
};
