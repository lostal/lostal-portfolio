// src/scripts/theme.ts

class ThemeToggle extends HTMLElement {
  private themeIcon: HTMLElement | null = null;
  private html: HTMLElement;
  private mediaQuery: MediaQueryList;
  private userHasOverridden: boolean = false;

  constructor() {
    super();
    this.html = document.documentElement;
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  }

  connectedCallback() {
    this.themeIcon = this.querySelector('#themeIcon');

    const button = this.querySelector('button') || this;
    button.addEventListener('click', e => this.handleToggle(e));

    // Listen to system theme changes (efficient - event-driven, no polling)
    this.mediaQuery.addEventListener('change', e => this.handleSystemChange(e));

    // Initialize: always use system theme on page load
    this.applyTheme(this.getSystemTheme(), false);
  }

  disconnectedCallback() {
    // Cleanup listener when element is removed
    this.mediaQuery.removeEventListener('change', e => this.handleSystemChange(e));
  }

  private getSystemTheme(): 'dark' | 'light' {
    return this.mediaQuery.matches ? 'dark' : 'light';
  }

  private handleSystemChange(e: MediaQueryListEvent): void {
    // Only follow system changes if user hasn't manually overridden
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

  private applyTheme(theme: string, animate: boolean = false): void {
    this.html.setAttribute('data-theme', theme);
    this.updateThemeIcon(animate);

    // Dispatch event for other components if needed
    window.dispatchEvent(
      new CustomEvent('theme-changed', { detail: { theme } })
    );
  }

  private handleToggle(e: Event): void {
    e.preventDefault();

    // Mark that user has manually overridden
    this.userHasOverridden = true;

    const currentTheme = this.html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme, true);

    const button = this.querySelector('button');
    if (button) {
      button.classList.add('animate');
      setTimeout(() => button.classList.remove('animate'), 800);
    }
  }
}

customElements.define('theme-toggle', ThemeToggle);
