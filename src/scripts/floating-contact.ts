// Widget flotante de contacto
import { canTouch } from '../utils/dom';

class FloatingContactWidget {
  widget: HTMLElement | null = null;
  contactSection: HTMLElement | null = null;
  projectsSection: HTMLElement | null = null;
  isVisible = false;
  isAnimating = false;
  cachedPositions = { projectsTop: 0, contactTop: 0, lastUpdate: 0 };
  ticking = false;

  constructor() {
    // Solo inicializar en desktop
    if (!canTouch() && !window.matchMedia('(max-width: 768px)').matches) {
      this.init();
    }
  }

  init() {
    // Encontrar elementos
    this.widget = document.getElementById('floating-contact');
    this.contactSection = document.getElementById('contact');
    this.projectsSection = document.getElementById('projects');

    if (!this.widget || !this.contactSection || !this.projectsSection) {
      console.warn('FloatingContact: Elementos requeridos no encontrados');
      return;
    }

    // Calcular posiciones iniciales
    this.updateCachedPositions();

    // Setup scroll listener optimizado
    window.addEventListener('scroll', () => this.requestTick(), {
      passive: true,
    });

    // Actualizar cache en resize
    window.addEventListener(
      'resize',
      () => {
        this.updateCachedPositions();
      },
      { passive: true }
    );

    // Evaluar estado inicial
    this.handleScroll();
  }

  requestTick() {
    if (!this.ticking) {
      requestAnimationFrame(() => this.handleScroll());
      this.ticking = true;
    }
  }

  updateCachedPositions() {
    if (!this.projectsSection || !this.contactSection) return;

    // Usar getBoundingClientRect() y calcular una sola vez
    const projectsRect = (
      this.projectsSection as HTMLElement
    ).getBoundingClientRect();
    const contactRect = (
      this.contactSection as HTMLElement
    ).getBoundingClientRect();
    const scrollY = window.scrollY;

    this.cachedPositions = {
      projectsTop: projectsRect.top + scrollY,
      contactTop: contactRect.top + scrollY,
      lastUpdate: Date.now(),
    };
  }

  handleScroll() {
    this.ticking = false;

    if (this.isAnimating || !this.widget) return;

    // Actualizar cache si es muy antigua (más de 5 segundos)
    if (Date.now() - this.cachedPositions.lastUpdate > 5000) {
      this.updateCachedPositions();
    }

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Usar posiciones cacheadas para evitar reflows
    const { projectsTop, contactTop } = this.cachedPositions;

    // LÓGICA EXACTA:
    // 1. Mostrar después de proyectos
    const afterProjects = scrollY + windowHeight > projectsTop + 200;

    // 2. OCULTAR EXACTAMENTE cuando los iconos de contacto están visibles
    const contactIconsVisible = scrollY + windowHeight > contactTop + 100;

    const shouldShow = afterProjects && !contactIconsVisible;

    // Actualizar visibilidad con animaciones
    if (shouldShow && !this.isVisible) {
      this.show();
    } else if (!shouldShow && this.isVisible) {
      this.hide();
    }
  }

  show() {
    if (this.isVisible || this.isAnimating) return;

    this.isAnimating = true;
    this.isVisible = true;

    // Remover clases de animación previa
    this.widget!.classList.remove('slide-down');

    // Mostrar widget
    this.widget!.classList.add('visible');

    // Agregar animación de deslizamiento hacia arriba
    this.widget!.classList.add('slide-up');

    // Limpiar animación después
    setTimeout(() => {
      this.widget!.classList.remove('slide-up');
      this.isAnimating = false;
    }, 500);
  }

  hide() {
    if (!this.isVisible || !this.widget) return;

    if (this.isAnimating) return;

    this.isAnimating = true;
    this.isVisible = false;

    // Remover clases de animación previa
    this.widget.classList.remove('slide-up');

    // Agregar animación de deslizamiento hacia abajo
    this.widget!.classList.add('slide-down');

    // Después de la animación, ocultar completamente
    setTimeout(() => {
      this.widget!.classList.remove('visible', 'slide-down');
      this.isAnimating = false;
    }, 400);
  }
}

// Inicialización simple
(function initFloatingContact() {
  function bootstrap() {
    new FloatingContactWidget();
  }
  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    // Si el documento ya está parseado, inicializar inmediatamente
    bootstrap();
  } else {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  }
})();
