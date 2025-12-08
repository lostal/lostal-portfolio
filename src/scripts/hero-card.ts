export class HeroCardManager {
  heroImage: HTMLElement | null;
  heroImageWrapper: HTMLElement | null;
  aboutCard: HTMLElement | null;
  closeButton: HTMLElement | null;
  overlay: HTMLElement | null;
  profileIndicator: HTMLElement | null;
  isCardOpen: boolean;
  isMobile: boolean;
  cachedHeaderHeight: number | null;
  toggleCardBound: ((e: Event) => void) | null;
  hideCardBound: (() => void) | null;
  showCardBound: (() => void) | null;

  constructor() {
    this.heroImage = document.getElementById('heroImage');
    this.heroImageWrapper = document.querySelector('.hero-image-wrapper');
    this.aboutCard = document.getElementById('aboutCard');
    this.closeButton = document.getElementById('closeCard');
    this.overlay = document.getElementById('cardOverlay');
    this.profileIndicator = document.querySelector('.profile-indicator');
    this.isCardOpen = false;
    this.isMobile = window.innerWidth <= 768;
    this.cachedHeaderHeight = null; // Cache para evitar reflows
    this.toggleCardBound = null;
    this.hideCardBound = null;
    this.showCardBound = null;

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

    // Eventos que no cambian con el tipo de dispositivo
    this.bindStaticEvents();

    // Redimensionar ventana
    window.addEventListener('resize', () => this.handleResize());
  }

  bindStaticEvents() {
    // Cerrar card
    this.closeButton?.addEventListener('click', () => this.hideCard());
    this.overlay?.addEventListener('click', () => this.hideCard());

    // Teclado - usar el wrapper para mayor área de interacción
    this.heroImageWrapper?.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleCard();
      }
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isCardOpen) {
        this.hideCard();
      }
    });
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
  }

  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;

    if (wasMobile !== this.isMobile) {
      this.hideCard(true); // Force hide without animation
      this.bindEvents(); // Re-bind events for new device type
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

    // Cache header height to avoid repeated DOM queries
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

    // Note: Profile indicator stays visible during hover now

    // Añadir clases para animación
    this.aboutCard.classList.add('show');
    this.aboutCard.setAttribute('aria-hidden', 'false');

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

    // Focus management para accesibilidad
    setTimeout(() => {
      if (this.isMobile) {
        this.closeButton?.focus();
      }
    }, 300);
  }

  hideCard(force = false) {
    if ((!this.isCardOpen && !force) || !this.aboutCard) return;

    this.isCardOpen = false;

    // Note: Profile indicator visibility managed by CSS only now

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
