/* eslint-disable @typescript-eslint/no-explicit-any */
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// @ts-expect-error - Pusher is needed for Laravel Echo even if using Reverb
window.Pusher = Pusher;

/**
 * Capa global para comunicación vía Websockets (Laravel Echo + Reverb)
 */
const socket = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
  wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
  enabledTransports: ["ws", "wss"],
});

/**
 * Helper para suscribirse a eventos de forma más sencilla
 * @param channelName Nombre del canal
 * @param eventName Nombre del evento
 * @param callback Función a ejecutar cuando llegue el evento
 */
export const onSocketEvent = (
  channelName: string,
  eventName: string,
  callback: (data: any) => void,
) => {
  console.log(`[Socket] Escuchando: ${channelName} -> ${eventName}`);
  return socket.channel(channelName).listen(`.${eventName}`, callback);
};

export { socket };
