// src/scripts/theme.ts - Gestor de tema claro/oscuro con transición cinematográfica

const THEME_STORAGE_KEY = 'user-theme-preference';

class ThemeToggle extends HTMLElement {
  private themeIcon: HTMLElement | null = null;
  private html: HTMLElement;
  private mediaQuery: MediaQueryList;
  private userHasOverridden: boolean = false;
  private boundHandleSystemChange: (e: MediaQueryListEvent) => void;

  constructor() {
    super();
    this.html = document.documentElement;
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.boundHandleSystemChange = this.handleSystemChange.bind(this);
  }

  connectedCallback() {
    this.themeIcon = this.querySelector('#themeIcon');

    const button = this.querySelector('button') || this;
    button.addEventListener('click', e => this.handleToggle(e));

    this.mediaQuery.addEventListener('change', this.boundHandleSystemChange);

    const savedTheme = this.getSavedTheme();
    if (savedTheme) {
      this.userHasOverridden = true;
      this.applyTheme(savedTheme, false);
    } else {
      this.applyTheme(this.getSystemTheme(), false);
    }
  }

  private getSavedTheme(): 'dark' | 'light' | null {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch {
      // localStorage no disponible
    }
    return null;
  }

  private saveTheme(theme: string): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // localStorage no disponible
    }
  }

  disconnectedCallback() {
    this.mediaQuery.removeEventListener('change', this.boundHandleSystemChange);
  }

  private getSystemTheme(): 'dark' | 'light' {
    return this.mediaQuery.matches ? 'dark' : 'light';
  }

  private handleSystemChange(e: MediaQueryListEvent): void {
    if (!this.userHasOverridden) {
      this.applyTheme(e.matches ? 'dark' : 'light', false);
    }
  }

  private updateThemeIcon(animate: boolean = false): void {
    if (!this.themeIcon) return;

    this.themeIcon.classList.remove('fa-moon', 'fa-sun', 'fa-lightbulb');
    this.themeIcon.classList.add('fa-lightbulb');

    if (animate) {
      this.themeIcon.style.transition = 'all 0.3s ease';
      this.themeIcon.style.transform = 'rotate(20deg)';
      setTimeout(() => {
        if (this.themeIcon) this.themeIcon.style.transform = 'rotate(0deg)';
      }, 300);
    } else {
      this.themeIcon.style.transition = 'none';
      this.themeIcon.style.transform = 'rotate(0deg)';
    }
  }

  private updateBrowserChrome(theme: string): void {
    const themeColor = theme === 'dark' ? '#000000' : '#fafaf9';
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      meta.setAttribute('content', themeColor);
    });
    this.html.style.colorScheme = theme;
  }

  private applyTheme(theme: string, animate: boolean = false): void {
    this.html.setAttribute('data-theme', theme);
    this.updateBrowserChrome(theme);
    this.updateThemeIcon(animate);

    window.dispatchEvent(
      new CustomEvent('theme-changed', { detail: { theme } })
    );
  }

  /**
   * Transición cinematográfica de tema con círculo expandible
   * Usa View Transitions API para crear efecto premium
   */
  private async handleToggle(e: Event): Promise<void> {
    e.preventDefault();

    this.userHasOverridden = true;

    const currentTheme = this.html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    this.saveTheme(newTheme);

    // Obtener posición del botón para el origen del círculo
    const button = this.querySelector('button') as HTMLElement;
    const rect = button?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : 0;

    // Calcular el radio máximo necesario para cubrir toda la pantalla
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Verificar si View Transitions API está disponible
    if (!document.startViewTransition) {
      // Fallback sin animación
      this.applyTheme(newTheme, true);
      return;
    }

    // Crear la transición con círculo expandible
    const transition = document.startViewTransition(() => {
      this.applyTheme(newTheme, true);
    });

    // Animar el clip-path del círculo
    transition.ready.then(() => {
      // Siempre expandir el círculo revelando el nuevo tema
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 500,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    });

    // Animación del botón
    if (button) {
      button.classList.add('animate');
      setTimeout(() => button.classList.remove('animate'), 800);
    }
  }
}

customElements.define('theme-toggle', ThemeToggle);
