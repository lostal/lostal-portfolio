/**
 * hero-snap.ts
 * Auto-scroll del hero a la sección siguiente al hacer scroll hacia abajo.
 * Solo en desktop (no táctil, no prefers-reduced-motion).
 *
 * Usamos fase de captura para interceptar el evento wheel ANTES que Lenis,
 * evitando que ambos procesen el mismo delta y produzcan un scroll doble.
 */

import { onReady } from '../utils/init';
import { isPrimaryInputTouch } from '../utils/dom';
import { SCROLL } from '../utils/constants';

onReady(() => {
  if (isPrimaryInputTouch()) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.getElementById('hero');
  const projects = document.getElementById('projects');
  if (!hero || !projects) return;

  let snapping = false;

  const onWheel = (e: WheelEvent) => {
    // Bloquear todo input durante la animación de snap
    if (snapping) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Solo si seguimos en la parte superior del hero
    if (window.scrollY > hero.offsetHeight * 0.35) return;
    // Solo scroll hacia abajo
    if (e.deltaY <= 0) return;

    e.preventDefault();
    e.stopPropagation();
    snapping = true;

    const lenis = window.lenis;
    if (lenis) {
      lenis.scrollTo(projects, {
        offset: -SCROLL.SMOOTH_SCROLL_OFFSET,
        duration: 1.0,
        easing: (t: number) => 1 - Math.pow(1 - t, 3), // ease-out cubic
        lock: true,
        onComplete: () => {
          snapping = false;
        },
      });
    } else {
      // Fallback (no debería ocurrir con las mismas guards que Lenis)
      window.scrollTo({
        top: projects.offsetTop - SCROLL.SMOOTH_SCROLL_OFFSET,
        behavior: 'smooth',
      });
      setTimeout(() => {
        snapping = false;
      }, 1000);
    }
  };

  // Fase de captura: dispara antes que los listeners de Lenis (bubble phase)
  window.addEventListener('wheel', onWheel, { passive: false, capture: true });
});
