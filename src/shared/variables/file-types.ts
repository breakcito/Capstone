import React from "react";
import {
  IconFileSpreadsheet,
  IconFileTypeDocx,
  IconFileTypePdf,
  IconFileTypePpt,
  IconFileTypeTxt,
  IconFileTypeZip,
  IconHelp,
  IconPhoto,
} from "@tabler/icons-react";

export interface FileTypeConfig {
  extensions: string[];
  color: string;
  bgColor: string;
  icon: React.ElementType;
  label: string;
}

export const FILE_TYPES: Record<string, FileTypeConfig> = {
  PDF: {
    extensions: ["pdf"],
    color: "red.6",
    bgColor: "red.8",
    icon: IconFileTypePdf,
    label: "Documento PDF",
  },
  IMAGE: {
    extensions: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
    color: "teal.6",
    bgColor: "teal.8",
    icon: IconPhoto,
    label: "Imagen",
  },
  WORD: {
    extensions: ["doc", "docx", "dot", "dotx", "odt"],
    color: "indigo.6",
    bgColor: "indigo.8",
    icon: IconFileTypeDocx,
    label: "Word",
  },
  EXCEL: {
    extensions: ["xls", "xlsx", "xlsm", "csv", "ods"],
    color: "green.6",
    bgColor: "green.8",
    icon: IconFileSpreadsheet,
    label: "Excel",
  },
  POWERPOINT: {
    extensions: ["ppt", "pptx", "pps", "ppsx", "odp"],
    color: "orange.6",
    bgColor: "orange.8",
    icon: IconFileTypePpt,
    label: "PowerPoint",
  },
  TEXT: {
    extensions: ["txt", "md", "log", "json", "xml"],
    color: "gray.6",
    bgColor: "gray.8",
    icon: IconFileTypeTxt,
    label: "Texto",
  },
  ARCHIVE: {
    extensions: ["zip", "rar", "7z", "tar", "gz"],
    color: "yellow.6",
    bgColor: "yellow.8",
    icon: IconFileTypeZip,
    label: "Comprimido",
  },
};

export const DEFAULT_FILE_TYPE: FileTypeConfig = {
  extensions: [],
  color: "zinc.6",
  bgColor: "zinc.8",
  icon: IconHelp,
  label: "Archivo",
};

export const getFileTypeConfig = (extension: string): FileTypeConfig => {
  const ext = extension.toLowerCase().replace(".", "");
  for (const key in FILE_TYPES) {
    if (FILE_TYPES[key].extensions.includes(ext)) {
      return FILE_TYPES[key];
    }
  }
  return DEFAULT_FILE_TYPE;
};
