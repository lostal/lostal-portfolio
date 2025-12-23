/**
 * Parallax Effect for Hero Section
 * Mueve el patrón de dots con el scroll para añadir profundidad
 */

import { onReady } from '../utils/init';

class HeroParallax {
  private heroSection: HTMLElement | null;
  private dotsElement: HTMLElement | null;
  private ticking = false;
  private parallaxFactor = 0.15; // Factor de movimiento sutil

  constructor() {
    this.heroSection = document.getElementById('hero');
    this.dotsElement = this.heroSection;

    if (this.heroSection) {
      this.init();
    }
  }

  private init(): void {
    // Solo en desktop y si no prefiere reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
  }

  private onScroll(): void {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.updateParallax();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  private updateParallax(): void {
    if (!this.heroSection) return;

    const scrollY = window.scrollY;
    const heroHeight = this.heroSection.offsetHeight;

    // Solo aplicar parallax mientras el hero esté visible
    if (scrollY > heroHeight) return;

    // Mover el background-position del pseudo-elemento
    const offset = scrollY * this.parallaxFactor;
    this.heroSection.style.setProperty('--parallax-offset', `${offset}px`);
  }
}

onReady(() => new HeroParallax());
