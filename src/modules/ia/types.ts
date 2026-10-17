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

/**
 * Llamada a herramienta que el modelo pidio en su turno.
 *
 * Se persiste en el mensaje del assistant para reenviarla al backend tal
 * cual (compatible con el formato OpenAI function-calling). Sin esto, el
 * modelo pierde la nocion de que ya uso una herramienta en turnos previos
 * y empieza a contestar "ya te lo envie antes".
 */
export interface ToolCall {
  id: string;
  nombre: string;
  argumentos: string;
}

export interface MensajeIA {
  id: string;
  rol: "user" | "assistant" | "tool";
  texto: string;
  /** Razonamiento del modelo, plegado en un <details>. */
  razonamiento?: string;
  adjuntos?: Adjunto[];
  herramienta?: HerramientaMensaje;
  archivo?: ArchivoMensaje;
  /** tool_calls del assistant. Solo presente en turnos donde decidio llamar herramientas. */
  tool_calls?: ToolCall[];
  /** tool_call_id del mensaje tool. Solo presente en mensajes de rol === "tool". */
  tool_call_id?: string;
  error?: boolean;
}

/**
 * Mensaje tal y como viaja al backend en formato OpenAI-compat.
 *
 * El backend es stateless: reenviamos la conversacion completa en cada
 * request, asi que tenemos que preservar la cadena de tool_calls y los
 * mensajes tool para que el modelo tenga continuidad entre turnos.
 */
export interface MensajeAPI {
  role: "user" | "assistant" | "tool";
  content: string;
  /** Solo en assistant cuando el modelo decidio llamar herramientas. */
  tool_calls?: ToolCall[];
  /** Solo en tool. */
  tool_call_id?: string;
  /** Solo en tool. */
  name?: string;
}
