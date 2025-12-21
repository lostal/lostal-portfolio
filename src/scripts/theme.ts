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
   * Toggle de tema - usa las transiciones CSS existentes
   */
  private handleToggle(e: Event): void {
    e.preventDefault();

    this.userHasOverridden = true;

    const currentTheme = this.html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    this.saveTheme(newTheme);
    this.applyTheme(newTheme, true);

    // Animación del botón
    const button = this.querySelector('button');
    if (button) {
      button.classList.add('animate');
      setTimeout(() => button.classList.remove('animate'), 800);
    }
  }
}

customElements.define('theme-toggle', ThemeToggle);
