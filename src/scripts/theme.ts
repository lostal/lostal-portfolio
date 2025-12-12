// src/scripts/theme.ts - Gestor de tema claro/oscuro

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
    // Vincular handler una vez para limpieza correcta
    this.boundHandleSystemChange = this.handleSystemChange.bind(this);
  }

  connectedCallback() {
    this.themeIcon = this.querySelector('#themeIcon');

    const button = this.querySelector('button') || this;
    button.addEventListener('click', e => this.handleToggle(e));

    // Escuchar cambios del tema del sistema (basado en eventos, sin polling)
    this.mediaQuery.addEventListener('change', this.boundHandleSystemChange);

    // Inicializar: usar tema guardado o tema del sistema
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
      // localStorage no disponible (modo privado en algunos navegadores)
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
    // Solo seguir cambios del sistema si el usuario no ha modificado manualmente
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
    // Actualizar TODAS las meta theme-color para iOS Safari
    // iOS necesita que se actualicen todas (con y sin media queries) para reflejar el cambio inmediatamente
    const themeColor = theme === 'dark' ? '#000000' : '#fafaf9';
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      meta.setAttribute('content', themeColor);
    });

    // Actualizar color-scheme para elementos nativos (scrollbars, inputs, etc.)
    this.html.style.colorScheme = theme;
  }

  private applyTheme(theme: string, animate: boolean = false): void {
    this.html.setAttribute('data-theme', theme);
    this.updateBrowserChrome(theme);
    this.updateThemeIcon(animate);

    // Disparar evento para otros componentes si es necesario
    window.dispatchEvent(
      new CustomEvent('theme-changed', { detail: { theme } })
    );
  }

  private handleToggle(e: Event): void {
    e.preventDefault();

    // Marcar que el usuario ha modificado manualmente
    this.userHasOverridden = true;

    const currentTheme = this.html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    // Guardar preferencia del usuario
    this.saveTheme(newTheme);
    this.applyTheme(newTheme, true);

    const button = this.querySelector('button');
    if (button) {
      button.classList.add('animate');
      setTimeout(() => button.classList.remove('animate'), 800);
    }
  }
}

customElements.define('theme-toggle', ThemeToggle);
