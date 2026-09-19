/**
 * Convierte una URL de imagen a base64 data URL.
 * Necesario para react-pdf, que usa fetch() con CORS estricto durante el renderizado.
 * Al convertir a base64 ANTES del render, react-pdf no hace requests HTTP propios.
 */
export async function imageToBase64(url: string): Promise<string | null> {
  if (!url) return null;
  // Si ya es base64, devolverla directamente
  if (url.startsWith("data:")) return url;

  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) return null;

    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}
