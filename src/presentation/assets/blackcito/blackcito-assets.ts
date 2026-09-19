/**
 * ESTE ARCHIVO ES EL "INTERRUPTOR" PARA ELEGIR QUÉ VERSIÓN DE BLACKCITO USAR.
 */

// === OPCIÓN A: VERSIÓN PROPUESTA 2D ===
import feliz from './nuestro/feliz.webm';
import enojado from './nuestro/enojado.webm';

// === OPCIÓN B: VERSIÓN EN 3D ===
/*
import feliz from './jefe/feliz.webm';
import enojado from './jefe/enojado.webm';
*/

export const BlackcitoAssets = {
  feliz,
  enojado,
};

export type BlackcitoEmotion = keyof typeof BlackcitoAssets;
