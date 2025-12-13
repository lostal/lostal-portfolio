// Gestor del card flotante "About" en el Hero
export class HeroCardManager {
  private heroImage = document.getElementById('heroImage');
  private heroImageWrapper = document.querySelector('.hero-image-wrapper');
  private aboutCard = document.getElementById('aboutCard');
  private closeButton = document.getElementById('closeCard');
  private overlay = document.getElementById('cardOverlay');
  private profileIndicator = document.querySelector('.profile-indicator');
  private isCardOpen = false;
  private isMobile = window.innerWidth <= 768;
  private cachedHeaderHeight: number | null = null;
  private toggleCardBound: ((e: Event) => void) | null = null;
  private hideCardBound: (() => void) | null = null;
  private showCardBound: (() => void) | null = null;
  private resizeTimeout: number | null = null;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;

  constructor() {
    this.init();
  }

  init() {
    if (!this.heroImage || !this.aboutCard) return;

    this.bindEvents();
    this.handleResize();

    // Configurar posicionamiento inicial
    window.addEventListener('load', () => {
      this.calculateCardPosition();
    });
  }

  bindEvents() {
    // Limpiar eventos existentes
    this.removeAllEvents();

    // Desktop: hover events solo en la imagen
    if (!this.isMobile) {
      this.showCardBound = () => this.showCard();
      this.hideCardBound = () => this.hideCard();

      // Solo el wrapper controla la apertura/cierre
      this.heroImageWrapper?.addEventListener('mouseenter', this.showCardBound);
      this.heroImageWrapper?.addEventListener('mouseleave', this.hideCardBound);
    } else {
      // Mobile: touch events en el wrapper para mayor área táctil
      this.toggleCardBound = (e: Event) => {
        e.preventDefault();
        this.toggleCard();
      };

      this.heroImageWrapper?.addEventListener('click', this.toggleCardBound);
    }

    this.bindStaticEvents();

    // Resize con debounce para evitar recálculos excesivos
    window.addEventListener('resize', () => {
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = window.setTimeout(() => this.handleResize(), 150);
    });
  }

  bindStaticEvents() {
    // Cerrar card
    this.closeButton?.addEventListener('click', () => this.hideCard());
    this.overlay?.addEventListener('click', () => this.hideCard());

    // Guardar referencia para cleanup
    this.keydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isCardOpen) {
        this.hideCard();
      }
    };
    document.addEventListener('keydown', this.keydownHandler);
  }

  removeAllEvents() {
    if (this.showCardBound) {
      this.heroImageWrapper?.removeEventListener(
        'mouseenter',
        this.showCardBound
      );
    }
    if (this.hideCardBound) {
      this.heroImageWrapper?.removeEventListener(
        'mouseleave',
        this.hideCardBound
      );
    }
    if (this.toggleCardBound) {
      this.heroImageWrapper?.removeEventListener('click', this.toggleCardBound);
    }
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
    }
  }

  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;

    if (wasMobile !== this.isMobile) {
      this.hideCard(true); // Forzar ocultar sin animación
      this.bindEvents(); // Re-vincular eventos para nuevo tipo de dispositivo
    }

    if (this.isCardOpen) {
      // En móvil, recalcular con delay para asegurar dimensiones correctas
      if (this.isMobile) {
        setTimeout(() => {
          this.calculateCardPosition();
        }, 100);
      } else {
        this.calculateCardPosition();
      }
    }
  }

  calculateCardPosition() {
    if (!this.heroImage || !this.aboutCard) return;

    // Fase 1: SOLO lecturas del DOM (batch read)
    const imageRect = this.heroImage.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Cachear altura del header para evitar queries repetidas al DOM
    if (!this.cachedHeaderHeight) {
      const header =
        document.querySelector('nav') || document.querySelector('header');
      this.cachedHeaderHeight = header ? header.offsetHeight : 80;
    }
    const minTopMargin = this.cachedHeaderHeight + 20;

    // Fase 2: Cálculos puros (sin DOM)
    let cardX, cardY;

    if (this.isMobile || viewport.width <= 768) {
      // En móvil: centrado perfecto con dimensiones cacheadas
      const cardWidth = 360; // Usar dimensión fija para evitar reflows
      const cardHeight = 400;

      // Centrar horizontalmente con márgenes seguros
      const margins = 20;
      const availableWidth = viewport.width - margins * 2;
      const finalWidth = Math.min(cardWidth, availableWidth);

      cardX = (viewport.width - finalWidth) / 2;

      // Centrar verticalmente considerando el header
      const availableHeight = viewport.height - minTopMargin - margins;
      const finalHeight = Math.min(cardHeight, availableHeight);

      cardY = minTopMargin + (availableHeight - finalHeight) / 2;
    } else {
      // En desktop, posicionar a la derecha de la imagen
      const cardWidth = 400; // Usar dimensión fija
      const desiredX = imageRect.right + 40;
      const maxX = viewport.width - cardWidth - 30;

      cardX = Math.min(desiredX, maxX);

      // Calcular Y para que no toque el header
      const desiredY = imageRect.top;
      cardY = Math.max(minTopMargin, desiredY);

      // Asegurar que no se salga por abajo
      const maxY = viewport.height - 400 - 30; // Usar altura fija
      cardY = Math.min(cardY, maxY);
    }

    // Fase 3: SOLO escrituras del DOM en siguiente frame (batch write)
    requestAnimationFrame(() => {
      if (this.aboutCard) {
        this.aboutCard.style.left = `${Math.round(cardX)}px`;
        this.aboutCard.style.top = `${Math.round(cardY)}px`;
      }
    });
  }

  showCard() {
    if (this.isCardOpen || !this.aboutCard) return;

    this.isCardOpen = true;

    // Calcular posición inicial
    this.calculateCardPosition();

    // Nota: El indicador de perfil permanece visible durante el hover

    // Añadir clases para animación
    this.aboutCard.classList.add('show');
    this.aboutCard.setAttribute('aria-hidden', 'false');

    // Animar counters de stats
    this.animateCounters();

    if (this.isMobile && this.overlay) {
      this.overlay.classList.add('show');
      this.overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Recalcular posición después del render para móvil (más preciso)
      requestAnimationFrame(() => {
        setTimeout(() => {
          this.calculateCardPosition();
        }, 50);
      });
    }

    // Gestión de focus para accesibilidad
    setTimeout(() => {
      if (this.isMobile) {
        this.closeButton?.focus();
      }
    }, 300);
  }

  /**
   * Anima los números de stats contando hacia arriba
   */
  private animateCounters() {
    const statNumbers = this.aboutCard?.querySelectorAll('.stat-number');
    if (!statNumbers) return;

    statNumbers.forEach((stat) => {
      const element = stat as HTMLElement;

      // Usar data attribute para guardar el valor original (evita bugs con animaciones repetidas)
      if (!element.dataset.originalValue) {
        element.dataset.originalValue = element.textContent || '';
      }
      const finalValue = element.dataset.originalValue;

      // Solo animar si es un número
      const numericValue = parseInt(finalValue, 10);
      if (isNaN(numericValue)) {
        // Para B2, animar ciclando por niveles de inglés A1→A2→B1→B2
        if (finalValue === 'B2') {
          const levels = ['A1', 'A2', 'B1', 'B2'];
          const duration = 800;
          const startTime = performance.now();

          const animateLevel = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Calcular qué nivel mostrar basado en el progreso
            const levelIndex = Math.min(Math.floor(progress * levels.length), levels.length - 1);
            element.textContent = levels[levelIndex];

            if (progress < 1) {
              requestAnimationFrame(animateLevel);
            } else {
              element.textContent = 'B2'; // Asegurar valor final
            }
          };

          requestAnimationFrame(animateLevel);
        }
        return;
      }

      // Animar contador numérico (siempre desde un valor fijo cerca del final)
      const duration = 800;
      const startTime = performance.now();
      const startValue = numericValue - 50; // Empezar 50 antes del valor final

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out curve
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + (numericValue - startValue) * easeOut);

        element.textContent = currentValue.toString();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = finalValue; // Asegurar valor final exacto
        }
      };

      requestAnimationFrame(animate);
    });
  }

  hideCard(force = false) {
    if ((!this.isCardOpen && !force) || !this.aboutCard) return;

    this.isCardOpen = false;

    // Nota: La visibilidad del indicador de perfil se gestiona solo con CSS

    // Remover clases para animación
    this.aboutCard.classList.remove('show');
    this.aboutCard.setAttribute('aria-hidden', 'true');

    if (this.isMobile && this.overlay) {
      this.overlay.classList.remove('show');
      this.overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  toggleCard() {
    if (this.isCardOpen) {
      this.hideCard();
    } else {
      this.showCard();
    }
  }
}
