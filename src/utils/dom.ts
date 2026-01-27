/**
 * Utilidades para detección de capacidades del dispositivo
 * Con caché que se invalida en cambios de orientación/resize
 */

// Caché de resultados
const _cache: {
  canTouch: boolean | null;
  isPrimaryTouch: boolean | null;
} = {
  canTouch: null,
  isPrimaryTouch: null,
};

// Invalidar caché en cambios que pueden afectar el modo de entrada
if (typeof window !== 'undefined') {
  const invalidateCache = () => {
    _cache.canTouch = null;
    _cache.isPrimaryTouch = null;
  };

  // Detectar cambios en media queries de pointer/hover
  window
    .matchMedia('(pointer: coarse)')
    .addEventListener('change', invalidateCache);
  window
    .matchMedia('(hover: none)')
    .addEventListener('change', invalidateCache);
}

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
