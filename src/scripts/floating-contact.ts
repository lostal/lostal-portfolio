// Widget flotante de contacto con efecto dock
import { canTouch } from '../utils/dom';
import { TIMING, FLOATING_CONTACT } from '../utils/constants';

type WidgetState = 'hidden' | 'floating' | 'docked';

class FloatingContactWidget {
  widget: HTMLElement | null = null;
  dockPoint: HTMLElement | null = null;
  projectsSection: HTMLElement | null = null;
  originalParent: HTMLElement | null = null;
  state: WidgetState = 'hidden';
  isAnimating = false;
  cachedPositions = { projectsTop: 0, dockPointTop: 0, lastUpdate: 0 };
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
    this.dockPoint = document.getElementById('contact-dock-point');
    this.projectsSection = document.getElementById('projects');

    if (!this.widget || !this.dockPoint || !this.projectsSection) {
      console.warn('FloatingContact: Elementos requeridos no encontrados');
      return;
    }

    // Guardar padre original para poder restaurar
    this.originalParent = this.widget.parentElement;

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
    if (!this.projectsSection || !this.dockPoint) return;

    const projectsRect = this.projectsSection.getBoundingClientRect();
    const dockRect = this.dockPoint.getBoundingClientRect();
    const scrollY = window.scrollY;

    this.cachedPositions = {
      projectsTop: projectsRect.top + scrollY,
      dockPointTop: dockRect.top + scrollY,
      lastUpdate: Date.now(),
    };
  }

  handleScroll() {
    this.ticking = false;

    if (this.isAnimating || !this.widget) return;

    // Actualizar cache si es muy antigua
    if (Date.now() - this.cachedPositions.lastUpdate > TIMING.CACHE_EXPIRY) {
      this.updateCachedPositions();
    }

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    const { projectsTop, dockPointTop } = this.cachedPositions;

    // LÓGICA DE ESTADOS:
    // 1. HIDDEN: Aún no hemos pasado proyectos
    const afterProjects =
      scrollY + windowHeight >
      projectsTop + FLOATING_CONTACT.PROJECTS_TRIGGER_OFFSET;

    // 2. Calcular posición visual del widget flotante
    const { WIDGET_HEIGHT, WIDGET_BOTTOM_OFFSET } = FLOATING_CONTACT;
    const widgetVisualCenter =
      windowHeight - WIDGET_BOTTOM_OFFSET - WIDGET_HEIGHT / 2;
    const widgetAbsoluteY = scrollY + widgetVisualCenter;

    // 3. Anclar cuando el widget llegue visualmente al dock point
    const shouldDock = widgetAbsoluteY >= dockPointTop - WIDGET_HEIGHT / 2;

    // Determinar nuevo estado
    let newState: WidgetState;

    if (!afterProjects) {
      newState = 'hidden';
    } else if (shouldDock) {
      newState = 'docked';
    } else {
      newState = 'floating';
    }

    // Transicionar si cambió el estado
    if (newState !== this.state) {
      this.transitionTo(newState);
    }
  }

  transitionTo(newState: WidgetState) {
    const oldState = this.state;
    this.state = newState;

    if (!this.widget || !this.dockPoint || !this.originalParent) return;

    // Remover todas las clases de estado previas
    this.widget.classList.remove(
      'visible',
      'docked',
      'slide-up',
      'slide-down',
      'docking'
    );

    switch (newState) {
      case 'hidden':
        if (oldState === 'floating') {
          // Estábamos flotando, animar hacia abajo
          this.isAnimating = true;
          this.widget.classList.add('visible', 'slide-down');
          setTimeout(() => {
            this.widget!.classList.remove('visible', 'slide-down');
            this.isAnimating = false;
          }, 400);
        } else if (oldState === 'docked') {
          // Estábamos anclados, mover de vuelta al body y ocultar
          this.undockWidget();
        }
        break;

      case 'floating':
        if (oldState === 'hidden') {
          // Aparecer desde abajo
          this.isAnimating = true;
          this.widget.classList.add('visible', 'slide-up');
          setTimeout(() => {
            this.widget!.classList.remove('slide-up');
            this.isAnimating = false;
          }, 500);
        } else if (oldState === 'docked') {
          // Desanclar y volver a flotar
          this.undockWidget();
          this.widget.classList.add('visible');
        }
        break;

      case 'docked':
        if (oldState === 'floating' || oldState === 'hidden') {
          // Anclar el widget en el dock point
          this.dockWidget();
        }
        break;
    }
  }

  dockWidget() {
    if (!this.widget || !this.dockPoint) return;

    // Mover el widget dentro del dock point
    this.dockPoint.appendChild(this.widget);

    // Aplicar estado docked
    this.widget.classList.remove('visible');
    this.widget.classList.add('docked');

    // Actualizar posiciones después del dock
    setTimeout(() => this.updateCachedPositions(), 50);
  }

  undockWidget() {
    if (!this.widget || !this.originalParent) return;

    // Mover el widget de vuelta a su padre original (body)
    this.originalParent.appendChild(this.widget);

    // Quitar estado docked
    this.widget.classList.remove('docked');

    // Actualizar posiciones después del undock
    setTimeout(() => this.updateCachedPositions(), 50);
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
    bootstrap();
  } else {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  }
})();
