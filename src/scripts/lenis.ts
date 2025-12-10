/**
 * Lenis Smooth Scroll - Inicialización y configuración
 * Proporciona un scroll "weighty" pero responsivo estilo premium
 */

import Lenis from 'lenis';
import { isPrimaryInputTouch } from '../utils/dom';

// Respetar preferencias de accesibilidad
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

/**
 * Inicializa Lenis con configuración optimizada
 */
function initLenis(): void {
  // No inicializar en dispositivos táctiles ni si prefiere movimiento reducido
  // Lenis no aporta beneficio en táctiles y consume recursos (RAF constante)
  if (prefersReducedMotion || isPrimaryInputTouch()) {
    return;
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  // RAF loop para Lenis
  function raf(time: number): void {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLenis);
} else {
  initLenis();
}
