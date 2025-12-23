/**
 * Script de Navegación
 * Gestiona: scroll de navbar, menú móvil, cambio de idioma, scroll suave
 */
import { canTouch } from '../utils/dom';
import { SCROLL } from '../utils/constants';
import { onReady } from '../utils/init';

class NavigationManager {
  private navbar: HTMLElement | null;
  private scrollDown: HTMLElement | null;
  private mobileMenuBtn: HTMLElement | null;
  private mobileMenu: HTMLElement | null;
  private mobileLinks: NodeListOf<Element>;
  private langBtn: HTMLElement | null;
  private langPopover: HTMLElement | null;
  private langMenu: HTMLElement | null;
  private langIcon: HTMLElement | null;
  private langAnimTimeout: number | undefined;

  // Scroll direction tracking
  private lastScrollY: number = 0;
  private scrollDirection: 'down' | 'up' = 'down';
  private logo: HTMLElement | null;
  private navLinks: NodeListOf<HTMLAnchorElement>;
  private currentActiveSection: string | null = null;
  private sectionObserver: IntersectionObserver | null = null;

  constructor() {
    this.navbar = document.getElementById('navbar');
    this.scrollDown = document.getElementById('scrollDown');
    this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    this.mobileMenu = document.getElementById('mobileMenu');
    this.mobileLinks = document.querySelectorAll('.mobile-link');
    this.langBtn = document.getElementById('langBtn');
    this.langPopover = document.getElementById('langPopover');
    this.langMenu = document.querySelector('.lang-menu');
    this.langIcon = document.getElementById('langIcon');
    this.logo = document.querySelector('.logo');
    this.navLinks = document.querySelectorAll('.nav-links a');

    this.init();
  }

  private init(): void {
    this.initNavbarScroll();
    this.initMobileMenu();
    this.initLanguageSwitcher();
    this.initSmoothScroll();
    this.initActiveSection();
  }

  private initNavbarScroll(): void {
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
  }

  private handleScroll(): void {
    const scrollPosition = window.scrollY;

    // Track scroll direction
    if (scrollPosition > this.lastScrollY) {
      this.scrollDirection = 'down';
    } else if (scrollPosition < this.lastScrollY) {
      this.scrollDirection = 'up';
    }
    this.lastScrollY = scrollPosition;

    // Estado de navbar al hacer scroll
    if (this.navbar) {
      if (scrollPosition > SCROLL.NAVBAR_THRESHOLD)
        this.navbar.classList.add('scrolled');
      else this.navbar.classList.remove('scrolled');
    }

    // Ocultar flecha de scroll
    if (this.scrollDown) {
      if (scrollPosition > SCROLL.SCROLL_DOWN_HIDE_THRESHOLD)
        this.scrollDown.classList.add('hidden');
      else this.scrollDown.classList.remove('hidden');
    }
  }

  private initActiveSection(): void {
    // Only apply on desktop (>= 768px)
    if (window.innerWidth < 768) return;

    const sections = ['hero', 'projects', 'journey', 'technologies', 'contact'];
    const sectionElements = sections
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    // Set initial active state based on scroll position
    // If at the top, hero should be active
    if (window.scrollY < 100) {
      this.setActiveSection('hero');
    }

    // Create IntersectionObserver to detect which section is in view
    this.sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-40% 0px -55% 0px', // Trigger when section is in the middle 45% of viewport
        threshold: 0,
      }
    );

    sectionElements.forEach(section => {
      this.sectionObserver?.observe(section);
    });

    // Handle window resize to disable on mobile
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  private handleResize(): void {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Remove all active states on mobile
      this.clearActiveStates();
    }
  }

  private setActiveSection(sectionId: string): void {
    // Only apply on desktop
    if (window.innerWidth < 768) return;

    this.currentActiveSection = sectionId;

    // Determine scroll direction class
    const directionClass =
      this.scrollDirection === 'down' ? 'scroll-down' : 'scroll-up';
    const oppositeDirectionClass =
      this.scrollDirection === 'down' ? 'scroll-up' : 'scroll-down';

    // Handle logo active state (for hero section)
    if (this.logo) {
      this.logo.classList.remove('scroll-down', 'scroll-up');
      this.logo.classList.add(directionClass);

      if (sectionId === 'hero') {
        this.logo.classList.add('active');
      } else {
        this.logo.classList.remove('active');
      }
    }

    // Handle nav links active states
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const linkSection = href?.replace('#', '') || '';

      // Remove opposite direction class, add current direction
      link.classList.remove(oppositeDirectionClass);
      link.classList.add(directionClass);

      if (linkSection === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  private clearActiveStates(): void {
    this.logo?.classList.remove('active', 'scroll-down', 'scroll-up');
    this.navLinks.forEach(link => {
      link.classList.remove('active', 'scroll-down', 'scroll-up');
    });
    this.currentActiveSection = null;
  }

  private initMobileMenu(): void {
    if (this.mobileMenuBtn && this.mobileMenu) {
      this.mobileMenuBtn.addEventListener('click', () => {
        const isOpening = !this.mobileMenu?.classList.contains('active');

        if (isOpening) {
          this.openMobileMenu();
        } else {
          this.closeMobileMenu();
        }

        if (navigator.vibrate) navigator.vibrate(50);
      });
    }

    this.mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.setManualNavigation) window.setManualNavigation(true);
        this.closeMobileMenu();
      });
    });

    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', e => {
      if (!this.mobileMenu?.classList.contains('active')) return;

      const target = e.target as HTMLElement;
      const isClickInsideMenu = this.mobileMenu?.contains(target);
      const isClickOnButton = this.mobileMenuBtn?.contains(target);

      if (!isClickInsideMenu && !isClickOnButton) {
        this.closeMobileMenu();
      }
    });
  }

  private openMobileMenu(): void {
    this.mobileMenu?.classList.add('active');
    this.mobileMenuBtn?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  private closeMobileMenu(): void {
    if (this.mobileMenu) this.mobileMenu.classList.remove('active');
    if (this.mobileMenuBtn) this.mobileMenuBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  private initLanguageSwitcher(): void {
    if (this.langMenu) this.langMenu.dataset.ready = '0';

    if (this.langBtn && this.langPopover && this.langMenu) {
      // Comportamiento hover en desktop
      if (!canTouch()) {
        this.langMenu.addEventListener('mouseenter', () => this.openMenu());
        this.langMenu.addEventListener('mouseleave', () => this.closeMenu());
      }

      // Manejador de click: marcar cambio de idioma y navegar inmediatamente
      this.langBtn.addEventListener('click', () => {
        // Marcar que venimos de un cambio de idioma para animar en destino
        sessionStorage.setItem('lang-switch', '1');
      });

      // Manejadores de fin de animación
      if (this.langIcon) {
        this.langIcon.addEventListener('animationend', e => {
          if (e.animationName?.includes('lang-click-bounce-icon')) {
            this.langIcon?.classList.remove('clicked');
            if (this.langAnimTimeout) clearTimeout(this.langAnimTimeout);
          }
        });
      }

      this.langBtn.addEventListener('animationend', e => {
        if (e.animationName?.includes('lang-click-bounce-icon')) {
          this.langBtn?.classList.remove('clicked');
        }
      });

      // Navegación por teclado
      this.langBtn.addEventListener('keydown', e =>
        this.handleLangBtnKeydown(e as KeyboardEvent)
      );

      // Manejadores de enlaces del popover
      this.langPopover.querySelectorAll('a[data-lang]').forEach(link => {
        link.addEventListener('click', () => {
          this.animateIcon();
          this.closeMenu();
        });
        link.addEventListener('keydown', e =>
          this.handleLangLinkKeydown(e as KeyboardEvent, link as HTMLElement)
        );
      });

      this.initLangState();
    }
  }

  private openMenu(): void {
    this.langBtn?.setAttribute('aria-expanded', 'true');
    this.langMenu?.classList.add('open');
  }

  private closeMenu(): void {
    this.langBtn?.setAttribute('aria-expanded', 'false');
    this.langMenu?.classList.remove('open');
  }

  private animateIcon(): void {
    if (this.langIcon) {
      this.langIcon.classList.remove('clicked');
      void this.langIcon.offsetWidth; // Forzar reflow
      this.langIcon.classList.add('clicked');
      if (this.langAnimTimeout) clearTimeout(this.langAnimTimeout);
      this.langAnimTimeout = window.setTimeout(
        () => this.langIcon?.classList.remove('clicked'),
        580
      );
    }
  }

  private handleLangBtnKeydown(e: KeyboardEvent): void {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const first = this.langPopover?.querySelector(
        'a[data-lang]'
      ) as HTMLElement;
      first?.focus();
      this.openMenu();
    } else if (e.key === 'Escape') {
      this.closeMenu();
      this.langBtn?.focus();
    }
  }

  private handleLangLinkKeydown(e: KeyboardEvent, link: HTMLElement): void {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.closeMenu();
      this.langBtn?.focus();
      return;
    }

    const items = Array.from(
      this.langPopover?.querySelectorAll('a[data-lang]') || []
    ) as HTMLElement[];
    const idx = items.indexOf(link);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  }

  private getCurrentLang(): 'es' | 'en' {
    const path = window.location.pathname;
    return path.startsWith('/en/') || path === '/en' ? 'en' : 'es';
  }

  private initLangState(): void {
    const current = this.getCurrentLang();

    // Actualizar estado del botón
    this.langBtn?.setAttribute('data-lang', current);
    this.langBtn?.setAttribute(
      'aria-label',
      current === 'es' ? 'Idioma: Español' : 'Language: English'
    );
    if (this.langBtn)
      this.langBtn.title = current === 'es' ? 'Español' : 'English';

    // Actualizar selección del popover
    this.langPopover?.querySelectorAll('a[data-lang]').forEach(a => {
      a.classList.toggle('selected', a.getAttribute('data-lang') === current);
    });

    // Limpiar estado inicial
    this.closeMenu();
    this.langIcon?.classList.remove('clicked');
    this.langBtn?.classList.remove('clicked');

    // Detectar si venimos de un cambio de idioma y animar
    if (sessionStorage.getItem('lang-switch') === '1') {
      sessionStorage.removeItem('lang-switch');
      // Pequeño delay para que el icono ya esté renderizado
      requestAnimationFrame(() => {
        this.animateIcon();
      });
    }

    // Marcar como listo después de pequeño delay
    setTimeout(() => {
      if (this.langMenu) this.langMenu.dataset.ready = '1';
    }, 50);
  }

  private initSmoothScroll(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        e.preventDefault();

        const href = anchor.getAttribute('href');

        if (href === '#top') {
          if (window.setManualNavigation) window.setManualNavigation(true);
          // Usar Lenis si está disponible para evitar conflictos de scroll
          if (window.lenis) {
            window.lenis.scrollTo(0, { duration: 1.2 });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          setTimeout(() => {
            if (window.resetAutoScroll) window.resetAutoScroll();
          }, 600);
          return;
        }

        if (window.setManualNavigation) window.setManualNavigation(true);

        if (href) {
          const target = document.querySelector(href) as HTMLElement;
          if (target) {
            const targetPosition =
              target.offsetTop - SCROLL.SMOOTH_SCROLL_OFFSET;
            // Usar Lenis si está disponible para evitar conflictos de scroll
            if (window.lenis) {
              window.lenis.scrollTo(targetPosition, { duration: 1.2 });
            } else {
              requestAnimationFrame(() => {
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
              });
            }
          }
        }
      });
    });
  }
}

// Inicializar con helper estandarizado
onReady(() => new NavigationManager());
