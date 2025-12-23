/** parallax.ts - Efecto parallax sutil en el patrón de puntos del hero */

import { onReady } from '../utils/init';

class HeroParallax {
  private heroSection: HTMLElement | null;
  private ticking = false;
  private parallaxFactor = 0.15;

  constructor() {
    this.heroSection = document.getElementById('hero');
    if (this.heroSection) this.init();
  }

  private init(): void {
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
    if (scrollY > this.heroSection.offsetHeight) return;
    this.heroSection.style.setProperty(
      '--parallax-offset',
      `${scrollY * this.parallaxFactor}px`
    );
  }
}

onReady(() => new HeroParallax());
