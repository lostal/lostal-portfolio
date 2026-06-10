/** lenis.ts - Scroll suave premium para desktop */

import Lenis from 'lenis';
import { isPrimaryInputTouch } from '../utils/dom';
import { onReady } from '../utils/init';

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

let lenisInstance: Lenis | null = null;

function initLenis(): void {
  if (prefersReducedMotion || isPrimaryInputTouch()) {
    window.lenis = null;
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

  window.lenis = lenisInstance;

  function raf(time: number): void {
    if (lenisInstance) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
  }

  requestAnimationFrame(raf);
}

onReady(initLenis);
