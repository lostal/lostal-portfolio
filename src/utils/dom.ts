/**
 * Detecta si el dispositivo PUEDE usar entrada táctil.
 * Devuelve true incluso en laptops 2-en-1 con pantalla táctil.
 * Usar para: habilitar gestos táctiles opcionales.
 */
export function canTouch(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(pointer: coarse)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );
}

/**
 * Detecta si el dispositivo tiene como INPUT PRINCIPAL el táctil.
 * Devuelve false en laptops 2-en-1 si están usando ratón/trackpad.
 * Usar para: desactivar features de desktop (ej: Lenis, hover effects).
 */
export function isPrimaryInputTouch(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(hover: none)').matches;
}

/**
 * @deprecated Usar canTouch() o isPrimaryInputTouch() según el contexto.
 */
export const isTouchDevice = canTouch;

