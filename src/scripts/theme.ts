// src/scripts/theme.ts

class ThemeManager {
  private themeToggle: HTMLElement | null;
  private themeIcon: HTMLElement | null;
  private html: HTMLElement;

  constructor() {
    this.themeToggle = document.getElementById('themeToggle');
    this.themeIcon = document.getElementById('themeIcon');
    this.html = document.documentElement;

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
  }

  private init(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setTheme(savedTheme, false);
    } else {
      this.setTheme(this.getSystemTheme(), false);
    }

    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', (e) => this.handleToggle(e));
    }

    this.exposeDebugHelpers();
  }

  private handleToggle(e: Event): void {
    e.preventDefault();
    const currentTheme = this.html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme, true);

    // Optional: Add simple animation class if desired
    if (this.themeToggle) {
      this.themeToggle.classList.add('animate');
      setTimeout(() => this.themeToggle?.classList.remove('animate'), 800);
    }
  }

  private exposeDebugHelpers(): void {
    // Debug helper
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    ) {
      window.themeDebug = {
        getState: () => ({
          currentTheme: this.html.getAttribute('data-theme'),
          userOverride: !!localStorage.getItem('theme'),
          systemTheme: this.getSystemTheme(),
          deviceInfo: {
            deviceType: 'desktop',
            operatingSystem: 'unknown',
            touchScreen: false,
            orientation: false,
            isMobile: false
          }
        }),
        forceTheme: (theme: string) => this.setTheme(theme, true),
        resetToSystem: () => {
          localStorage.removeItem('theme');
          this.setTheme(this.getSystemTheme(), true);
        },
        showNotification: () => { }
      };
    }
  }
}

// Initialize
new ThemeManager();
