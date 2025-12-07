// src/scripts/theme.ts

class ThemeToggle extends HTMLElement {
  private themeIcon: HTMLElement | null = null;
  private html: HTMLElement;

  constructor() {
    super();
    this.html = document.documentElement;
  }

  connectedCallback() {
    this.themeIcon = this.querySelector('#themeIcon');

    // If not found inside, maybe it's globally available or passed slightly differently, 
    // but based on Navigation.astro structure:
    // <button id="themeToggle"><i id="themeIcon"></i></button>
    // We will wrap this in <theme-toggle> so this should be available inside.
    // Actually, if we keep the button inside, we should listen to click on the button or 'this'.
    // The previous code verified presence of themeToggle element.
    // If we wrap the button, 'this' acts as container.

    const button = this.querySelector('button') || this;
    button.addEventListener('click', (e) => this.handleToggle(e));

    // Initialize state
    this.init();
  }

  private getSystemTheme(): 'dark' | 'light' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  private updateThemeIcon(animate: boolean = false): void {
    if (!this.themeIcon) return;

    // Always ensure correct icon class
    this.themeIcon.classList.remove('fa-moon', 'fa-sun', 'fa-lightbulb');
    this.themeIcon.classList.add('fa-lightbulb');

    // Only animate if requested
    if (animate) {
      this.themeIcon.style.transition = 'all 0.3s ease';
      this.themeIcon.style.transform = 'rotate(20deg)';
      setTimeout(() => {
        if (this.themeIcon) this.themeIcon.style.transform = 'rotate(0deg)';
      }, 300);
    } else {
      // Ensure no residual transform if not animating
      this.themeIcon.style.transition = 'none';
      this.themeIcon.style.transform = 'rotate(0deg)';
    }
  }

  public setTheme(theme: string, animate: boolean = false): void {
    this.html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateThemeIcon(animate);

    // Dispatch event for other components if needed
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
  }

  private init(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setTheme(savedTheme, false);
    } else {
      this.setTheme(this.getSystemTheme(), false);
    }

    // Expose debug helpers if needed, or keeping it clean
  }

  private handleToggle(e: Event): void {
    e.preventDefault();
    const currentTheme = this.html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme, true);

    // Optional: Add simple animation class if desired
    const button = this.querySelector('button');
    if (button) {
      button.classList.add('animate');
      setTimeout(() => button.classList.remove('animate'), 800);
    }
  }
}

customElements.define('theme-toggle', ThemeToggle);
