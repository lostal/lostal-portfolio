/**
 * Lenis Smooth Scroll - Inicialización y configuración
 * Proporciona scroll suave estilo premium
 */

import Lenis from 'lenis';
import { isPrimaryInputTouch } from '../utils/dom';

// Respetar preferencias de accesibilidad
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Referencia global para cleanup
let lenisInstance: Lenis | null = null;
let rafId: number | null = null;

/**
 * Inicializa Lenis con configuración optimizada
 */
function initLenis(): void {
  // No inicializar en dispositivos táctiles ni si prefiere movimiento reducido
  // Lenis no aporta beneficio en táctiles y consume recursos (RAF constante)
  if (prefersReducedMotion || isPrimaryInputTouch()) {
    return;
  }

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  // RAF loop para Lenis con ID para cancelación
  function raf(time: number): void {
    if (lenisInstance) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
  }

  rafId = requestAnimationFrame(raf);
}

/**
 * Destruye la instancia de Lenis y cancela el RAF loop
 * Llamar al desmontar la página o en navegación SPA
 */
export function destroyLenis(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLenis);
} else {
  initLenis();
}
