/** Tipos del modulo de chat con IA. */

/** Adjunto que el usuario sube, pega o arrastra. */
export interface Adjunto {
  nombre: string;
  mime: string;
  /** Solo la parte base64, sin el prefijo data:... */
  base64: string;
  /** Data URL completa, para previsualizar sin volver a codificar. */
  previewUrl: string;
  tamano: number;
}

/** Herramienta que el modelo invoco, para mostrarla como estado legible. */
export interface HerramientaMensaje {
  nombre: string;
  estado: "ok" | "error";
  preview: string;
}

/** Reporte PDF generado por el backend y listo para descargar. */
export interface ArchivoMensaje {
  uuid: string;
  nombre: string;
  bytes: number;
}

export interface MensajeIA {
  id: string;
  rol: "user" | "assistant";
  texto: string;
  /** Razonamiento del modelo, plegado en un <details>. */
  razonamiento?: string;
  adjuntos?: Adjunto[];
  herramienta?: HerramientaMensaje;
  archivo?: ArchivoMensaje;
  error?: boolean;
}

/** Mensaje tal y como viaja al backend. No lleva adjuntos: van aparte. */
export interface MensajeAPI {
  role: "user" | "assistant";
  content: string;
}