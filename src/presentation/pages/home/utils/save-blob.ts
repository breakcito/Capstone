/**
 * Helper minimalista para descargar un Blob como archivo en el navegador.
 * Reemplaza el uso de la libreria `file-saver` para evitar una dependencia
 * extra: usamos el patron estandar de URL.createObjectURL + <a> temporal.
 */
export const saveBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Liberamos el blob despues de un tick para que el navegador alcance
  // a iniciar la descarga antes de revocar la URL.
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

// Re-export con el nombre saveAs para mantener consistencia con proyectos
// que ya usan file-saver.
export const saveAs = saveBlob;