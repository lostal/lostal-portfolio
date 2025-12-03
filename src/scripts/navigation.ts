/**
 * Navigation Script
 * Handles: navbar scroll, mobile menu, language switching, smooth scroll
 */
import { isTouchDevice } from '../utils/dom';

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

    this.init();
  }

  private init(): void {
    this.initNavbarScroll();
    this.initMobileMenu();
    this.initLanguageSwitcher();
    this.initSmoothScroll();
  }

  private initNavbarScroll(): void {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      if (this.navbar) {
        if (isTouchDevice()) {
          const aboutSection = document.getElementById('about');
          if (aboutSection) {
            const aboutPosition = aboutSection.offsetTop - 100;
            if (scrollPosition >= aboutPosition) this.navbar.classList.add('scrolled');
            else this.navbar.classList.remove('scrolled');
          }
        } else {
          if (scrollPosition > 50) this.navbar.classList.add('scrolled');
          else this.navbar.classList.remove('scrolled');
        }
      }
      if (this.scrollDown) {
        if (scrollPosition > 100) this.scrollDown.classList.add('hidden');
        else this.scrollDown.classList.remove('hidden');
      }
    }, { passive: true });
  }

  private initMobileMenu(): void {
    if (this.mobileMenuBtn && this.mobileMenu) {
      this.mobileMenuBtn.addEventListener('click', () => {
        this.mobileMenu?.classList.toggle('active');
        this.mobileMenuBtn?.classList.toggle('active');
        if (navigator.vibrate) navigator.vibrate(50);
      });
    }

    this.mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.setManualNavigation) window.setManualNavigation(true);
        if (this.mobileMenu) this.mobileMenu.classList.remove('active');
        if (this.mobileMenuBtn) this.mobileMenuBtn.classList.remove('active');
      });
    });
  }

  private initLanguageSwitcher(): void {
    if (this.langMenu) this.langMenu.dataset.ready = '0';

    if (this.langBtn && this.langPopover && this.langMenu) {
      // Desktop hover behavior
      if (!isTouchDevice()) {
        this.langMenu.addEventListener('mouseenter', () => this.openMenu());
        this.langMenu.addEventListener('mouseleave', () => this.closeMenu());
      }

      // Main button click handler
      this.langBtn.addEventListener('click', () => {
        this.animateIcon();
      });

      // Animation end handlers
      if (this.langIcon) {
        this.langIcon.addEventListener('animationend', (e) => {
          if (e.animationName?.includes('lang-click-bounce-icon')) {
            this.langIcon?.classList.remove('clicked');
            if (this.langAnimTimeout) clearTimeout(this.langAnimTimeout);
          }
        });
      }

      this.langBtn.addEventListener('animationend', (e) => {
        if (e.animationName?.includes('lang-click-bounce-icon')) {
          this.langBtn?.classList.remove('clicked');
        }
      });

      // Keyboard navigation
      this.langBtn.addEventListener('keydown', (e) => this.handleLangBtnKeydown(e as KeyboardEvent));

      // Popover link handlers
      this.langPopover.querySelectorAll('a[data-lang]').forEach(link => {
        link.addEventListener('click', () => {
          this.animateIcon();
          this.closeMenu();
        });
        link.addEventListener('keydown', (e) => this.handleLangLinkKeydown(e as KeyboardEvent, link as HTMLElement));
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
      void this.langIcon.offsetWidth; // Force reflow
      this.langIcon.classList.add('clicked');
      if (this.langAnimTimeout) clearTimeout(this.langAnimTimeout);
      this.langAnimTimeout = window.setTimeout(() => this.langIcon?.classList.remove('clicked'), 580);
    }
  }

  private handleLangBtnKeydown(e: KeyboardEvent): void {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const first = this.langPopover?.querySelector('a[data-lang]') as HTMLElement;
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

    const items = Array.from(this.langPopover?.querySelectorAll('a[data-lang]') || []) as HTMLElement[];
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

    // Update button state
    this.langBtn?.setAttribute('data-lang', current);
    this.langBtn?.setAttribute('aria-label', current === 'es' ? 'Idioma: Español' : 'Language: English');
    if (this.langBtn) this.langBtn.title = current === 'es' ? 'Español' : 'English';

    // Update popover selection
    this.langPopover?.querySelectorAll('a[data-lang]').forEach(a => {
      a.classList.toggle('selected', a.getAttribute('data-lang') === current);
    });

    // Clean up initial state
    this.closeMenu();
    this.langIcon?.classList.remove('clicked');
    this.langBtn?.classList.remove('clicked');

    // Mark as ready after short delay
    setTimeout(() => { if (this.langMenu) this.langMenu.dataset.ready = '1'; }, 50);
  }

  private initSmoothScroll(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();

        const href = anchor.getAttribute('href');

        if (href === '#top') {
          if (window.setManualNavigation) window.setManualNavigation(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => { if (window.resetAutoScroll) window.resetAutoScroll(); }, 600);
          return;
        }

        if (window.setManualNavigation) window.setManualNavigation(true);

        if (href) {
          const target = document.querySelector(href) as HTMLElement;
          if (target) {
            const offset = 60;
            const targetPosition = target.offsetTop - offset;
            requestAnimationFrame(() => {
              window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            });
          }
        }
      });
    });
  }
}

// Initialize
new NavigationManager();
