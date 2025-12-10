/**
 * AutoScroll Manager - Versión restaurada y mejorada
 * Basada en la versión original funcional, con umbrales ajustados
 */

import { canTouch } from '../utils/dom';
import { SCROLL } from '../utils/constants';

class AutoScrollManager {
  isAutoScrolling: boolean;
  isManualNavigation: boolean;
  hasTriggeredAutoScroll: boolean;
  isInitialized: boolean;
  scrollTimeout: number | null;
  esDispositivoTactil: boolean;

  constructor() {
    this.isAutoScrolling = false;
    this.isManualNavigation = false;
    this.hasTriggeredAutoScroll = false;
    this.isInitialized = false;
    this.scrollTimeout = null;

    this.esDispositivoTactil = canTouch();

    if (this.esDispositivoTactil) {
      return;
    }
    this.init();
  }

  init() {
    if (document.readyState === 'complete') {
      this.delayedInit();
    } else {
      window.addEventListener('load', () => this.delayedInit());
    }
  }

  delayedInit() {
    setTimeout(() => {
      // Si empezamos muy abajo, no activar nunca el autoscroll en esta sesión
      if (window.scrollY > 300) {
        this.hasTriggeredAutoScroll = true;
      }
      this.isInitialized = true;
      this.bindEvents();
    }, 400);
  }

  bindEvents() {
    const wheelHandler = (e: Event) => this.handleWheel(e as WheelEvent);

    window.addEventListener('wheel', wheelHandler, {
      passive: false,
      capture: true,
    });

    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            this.handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    document.addEventListener('keydown', (e: KeyboardEvent) =>
      this.handleKeyNavigation(e)
    );
    document.addEventListener('click', (e: MouseEvent) =>
      this.handleLinkClick(e)
    );
  }

  clearTimeouts() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }
  }

  handleScroll() {
    if (!this.isInitialized || this.isAutoScrolling) return;

    const currentScrollY = window.scrollY;

    // Resetear cuando el usuario vuelve cerca del top
    // Umbral generoso (200px) para compensar el smooth scroll de Lenis
    if (currentScrollY < SCROLL.AUTO_SCROLL_RESET_ZONE) {
      this.hasTriggeredAutoScroll = false;
      this.isManualNavigation = false;
    }
  }

  handleWheel(e: WheelEvent) {
    if (!this.isInitialized || this.isAutoScrolling) return;

    const currentScrollY = window.scrollY;

    // Verificar reset primero
    if (currentScrollY < SCROLL.AUTO_SCROLL_RESET_ZONE) {
      this.hasTriggeredAutoScroll = false;
      this.isManualNavigation = false;
    }

    // Solo activar autoscroll si:
    // - Rueda hacia abajo (deltaY > 0)
    // - Estamos en la zona de trigger
    // - No ya activado
    // - No navegación manual
    if (
      e.deltaY > 0 &&
      currentScrollY <= SCROLL.AUTO_SCROLL_TRIGGER_ZONE &&
      !this.hasTriggeredAutoScroll &&
      !this.isManualNavigation
    ) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      this.executeImmediateAutoScroll();
    }
  }

  executeImmediateAutoScroll() {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;

    this.isAutoScrolling = true;
    this.hasTriggeredAutoScroll = true;
    this.clearTimeouts();

    const rect = projectsSection.getBoundingClientRect();
    const targetPosition = window.scrollY + rect.top - SCROLL.SMOOTH_SCROLL_OFFSET;

    // Usar window.scrollTo nativo - más confiable que Lenis para esto
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });

    this.scrollTimeout = window.setTimeout(() => {
      this.isAutoScrolling = false;
    }, 1000);
  }

  handleKeyNavigation(e: KeyboardEvent) {
    const navigationKeys = [
      'PageDown', 'PageUp', 'Home', 'End', 'ArrowDown', 'ArrowUp', 'Space'
    ];

    if (navigationKeys.includes(e.code)) {
      const currentScrollY = window.scrollY;

      if (
        e.code === 'ArrowDown' &&
        currentScrollY < SCROLL.AUTO_SCROLL_TRIGGER_ZONE &&
        !this.hasTriggeredAutoScroll &&
        this.isInitialized &&
        !this.isAutoScrolling &&
        !this.isManualNavigation
      ) {
        e.preventDefault();
        this.executeImmediateAutoScroll();
      } else {
        this.setManualNavigation(true);
      }
    }
  }

  handleLinkClick(e: MouseEvent) {
    const target = (e.target as HTMLElement).closest('a[href^="#"]');
    if (target) {
      const href = target.getAttribute('href');

      if (href === '#top') {
        this.setManualNavigation(true);

        setTimeout(() => {
          if (window.scrollY < SCROLL.AUTO_SCROLL_RESET_ZONE) {
            this.hasTriggeredAutoScroll = false;
            this.isManualNavigation = false;
          }
        }, 800);
      } else {
        this.setManualNavigation(true);
      }
    }
  }

  setManualNavigation(isManual: boolean) {
    this.isManualNavigation = isManual;

    if (isManual) {
      this.clearTimeouts();
      const resetTime = window.scrollY < 100 ? 1000 : 2000;
      setTimeout(() => {
        this.isManualNavigation = false;
      }, resetTime);
    }
  }
}

let autoScrollManager: AutoScrollManager | null = null;

window.setManualNavigation = function (isManual: boolean) {
  if (autoScrollManager) {
    autoScrollManager.setManualNavigation(isManual);
  }
};

window.resetAutoScroll = function () {
  if (autoScrollManager) {
    autoScrollManager.hasTriggeredAutoScroll = false;
    autoScrollManager.isManualNavigation = false;
  }
};

function initAutoScrollManager() {
  if (autoScrollManager) return;
  autoScrollManager = new AutoScrollManager();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAutoScrollManager);
} else {
  setTimeout(initAutoScrollManager, 100);
}
