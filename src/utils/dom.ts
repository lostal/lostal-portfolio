/**
 * Detecta si el dispositivo actual es táctil.
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(pointer: coarse)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );
}
