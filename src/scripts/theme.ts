// src/scripts/theme.ts
(() => {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  function getSystemTheme(): 'dark' | 'light' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function updateThemeIcon(animate: boolean = false) {
    if (!themeIcon) return;

    // Always ensure correct icon class
    themeIcon.classList.remove('fa-moon', 'fa-sun', 'fa-lightbulb');
    themeIcon.classList.add('fa-lightbulb');

    // Only animate if requested
    if (animate) {
      themeIcon.style.transition = 'all 0.3s ease';
      themeIcon.style.transform = 'rotate(20deg)';
      setTimeout(() => {
        themeIcon.style.transform = 'rotate(0deg)';
      }, 300);
    } else {
      // Ensure no residual transform if not animating
      themeIcon.style.transition = 'none';
      themeIcon.style.transform = 'rotate(0deg)';
    }
  }

  function setTheme(theme: string, animate: boolean = false) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(animate);
  }

  // Initialize: Check localStorage first, otherwise system
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme, false);
    } else {
      setTheme(getSystemTheme(), false);
    }
  }

  // Toggle handler
  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = html.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme, true);

      // Optional: Add simple animation class if desired
      themeToggle.classList.add('animate');
      setTimeout(() => themeToggle.classList.remove('animate'), 800);
    });
  }

  initTheme();

  // Debug helper
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    window.themeDebug = {
      getState: () => ({
        currentTheme: html.getAttribute('data-theme'),
        userOverride: !!localStorage.getItem('theme'),
        systemTheme: getSystemTheme(),
        deviceInfo: {
          deviceType: 'desktop',
          operatingSystem: 'unknown',
          touchScreen: false,
          orientation: false,
          isMobile: false
        }
      }),
      forceTheme: (theme: string) => setTheme(theme, true),
      resetToSystem: () => {
        localStorage.removeItem('theme');
        setTheme(getSystemTheme(), true);
      },
      showNotification: () => { }
    };
  }
})();
