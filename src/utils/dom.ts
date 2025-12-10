/**
 * Utilidades para detección de capacidades del dispositivo
 * Con caché para evitar re-evaluación en cada llamada
 */

// Caché de resultados
const _cache: {
  canTouch: boolean | null;
  isPrimaryTouch: boolean | null;
} = {
  canTouch: null,
  isPrimaryTouch: null,
};

/**
 * Detecta si el dispositivo PUEDE usar entrada táctil.
 * Devuelve true incluso en laptops 2-en-1 con pantalla táctil.
 * Usar para: habilitar gestos táctiles opcionales.
 */
export function canTouch(): boolean {
  if (typeof window === 'undefined') return false;

  if (_cache.canTouch === null) {
    _cache.canTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;
  }
  return _cache.canTouch;
}

/**
 * Detecta si el dispositivo tiene como INPUT PRINCIPAL el táctil.
 * Devuelve false en laptops 2-en-1 si están usando ratón/trackpad.
 * Usar para: desactivar features de desktop (ej: Lenis, hover effects).
 */
export function isPrimaryInputTouch(): boolean {
  if (typeof window === 'undefined') return false;

  if (_cache.isPrimaryTouch === null) {
    _cache.isPrimaryTouch = window.matchMedia('(hover: none)').matches;
  }
  return _cache.isPrimaryTouch;
}

