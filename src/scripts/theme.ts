// src/scripts/theme.js
(() => {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  interface DeviceInfo {
    deviceType: 'mobile' | 'tablet' | 'desktop';
    operatingSystem: string;
    touchScreen: boolean;
    orientation: boolean;
    isMobile: boolean;
  }

  interface NotificationElement extends HTMLElement {
    _hideTimeout?: number | null;
  }

  let userManualOverride = false;
  const systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  let deviceInfo: DeviceInfo | null = null;
  let themeChangeInProgress = false;

  function getDeviceInfo(): DeviceInfo {
    if (deviceInfo) return deviceInfo;

    const maxTouchPoints = navigator.maxTouchPoints || 0;
    const hasTouchAPI = maxTouchPoints > 0;
    const pointerCoarse =
      window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    const touchScreen = hasTouchAPI || pointerCoarse || 'ontouchstart' in window;

    const isSmallWidth = window.innerWidth <= 768;
    const isTabletWidth = window.innerWidth > 768 && window.innerWidth <= 1024;

    const deviceType = isSmallWidth
      ? 'mobile'
      : isTabletWidth
        ? 'tablet'
        : 'desktop';

    deviceInfo = {
      deviceType,
      operatingSystem: navigator.platform || 'unknown',
      touchScreen,
      orientation: typeof window.orientation !== 'undefined',
      isMobile: deviceType === 'mobile' || deviceType === 'tablet',
    };

    return deviceInfo;
  }

  function getSystemTheme() {
    return systemThemeMediaQuery.matches ? 'dark' : 'light';
  }

  function getInitialTheme() {
    const manualOverride = sessionStorage.getItem('themeManualOverride');

    if (manualOverride === 'true') {
      const manualTheme = localStorage.getItem('theme');
      if (manualTheme) {
        userManualOverride = true;
        return manualTheme;
      }
    }

    userManualOverride = false;
    return getSystemTheme();
  }

  function applyTheme(theme: string, source = 'system') {
    if (!theme || themeChangeInProgress) return;

    themeChangeInProgress = true;
    const device = getDeviceInfo();

    // Optimización para móviles: aplicar tema sin transiciones si es necesario
    if (device.isMobile && source === 'system') {
      html.classList.add('theme-loading');
      requestAnimationFrame(() => {
        html.setAttribute('data-theme', theme);
        updateThemeIcon();
        requestAnimationFrame(() => {
          html.classList.remove('theme-loading');
          themeChangeInProgress = false;
        });
      });
    } else {
      html.setAttribute('data-theme', theme);
      updateThemeIcon();
      setTimeout(() => {
        themeChangeInProgress = false;
      }, 300);
    }

    if (source !== 'manual') {
      localStorage.removeItem('theme');
      sessionStorage.removeItem('themeManualOverride');
      userManualOverride = false;
    }
  }

  function updateThemeIcon() {
    if (!themeIcon) return;

    const device = getDeviceInfo();

    const animationDuration = device.isMobile ? '0.2s' : '0.3s';
    themeIcon.style.transition = `all ${animationDuration} ease`;

    themeIcon.classList.remove('fa-moon', 'fa-sun', 'fa-lightbulb');
    themeIcon.classList.add('fa-lightbulb');

    const rotationAngle = device.isMobile ? '15deg' : '20deg';
    themeIcon.style.transform = `rotate(${rotationAngle})`;
    setTimeout(
      () => {
        themeIcon.style.transform = 'rotate(0deg)';
      },
      device.isMobile ? 200 : 300
    );
  }

  const initialTheme = getInitialTheme();
  applyTheme(initialTheme, userManualOverride ? 'manual' : 'system');

  function handleSystemThemeChange(e: MediaQueryListEvent) {
    if (!userManualOverride) {
      const systemTheme = e.matches ? 'dark' : 'light';
      applyTheme(systemTheme, 'system');
    }
  }

  systemThemeMediaQuery.addEventListener('change', handleSystemThemeChange);

  if (systemThemeMediaQuery.addListener) {
    systemThemeMediaQuery.addListener(handleSystemThemeChange);
  }

  if (systemThemeMediaQuery.removeListener) {
    systemThemeMediaQuery.removeListener(handleSystemThemeChange);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', e => {
      e.preventDefault();

      const currentTheme = html.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      userManualOverride = true;
      themeToggle.classList.add('animate');

      setTimeout(() => {
        themeToggle.classList.remove('animate');
      }, 800);

      localStorage.setItem('theme', newTheme);
      sessionStorage.setItem('themeManualOverride', 'true');

      applyTheme(newTheme, 'manual');

      const device = getDeviceInfo();
      if ('vibrate' in navigator && device.touchScreen) {
        navigator.vibrate(50);
      }
    });

    let clickCount = 0;
    themeToggle.addEventListener('click', () => {
      clickCount++;
      setTimeout(() => {
        if (clickCount === 2) {
          userManualOverride = false;
          localStorage.removeItem('theme');
          sessionStorage.removeItem('themeManualOverride');

          const systemTheme = getSystemTheme();
          applyTheme(systemTheme, 'system');

          themeToggle.style.animation = 'pulse 0.6s ease-in-out';
          setTimeout(() => {
            themeToggle.style.animation = '';
          }, 600);

          showThemeNotification(
            `Tema sincronizado con el sistema (${systemTheme})`
          );
        }
        clickCount = 0;
      }, 300);
    });
  }

  function showThemeNotification(message: string) {
    const notification = document.getElementById('theme-notification') as NotificationElement | null;
    if (!notification) return;

    notification.textContent = message;
    notification.classList.add('is-visible');

    if (notification._hideTimeout) {
      window.clearTimeout(notification._hideTimeout);
    }
    notification._hideTimeout = window.setTimeout(() => {
      notification.classList.remove('is-visible');
    }, 3000);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !userManualOverride) {
      const currentSystemTheme = getSystemTheme();
      const currentPageTheme = html.getAttribute('data-theme');

      if (currentSystemTheme !== currentPageTheme) {
        applyTheme(currentSystemTheme, 'system');
      }
    }
  });

  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      if (!userManualOverride) {
        const currentSystemTheme = getSystemTheme();
        applyTheme(currentSystemTheme, 'system');
      }
    }, 100);
  });

  if (window.matchMedia) {
    const reduceMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    reduceMotionQuery.addEventListener('change', e => {
      if (e.matches) {
        document.documentElement.style.setProperty(
          '--animation-duration',
          '0.1s'
        );
      } else {
        document.documentElement.style.setProperty(
          '--animation-duration',
          '0.3s'
        );
      }
    });

    if (reduceMotionQuery.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
    }
  }

  window.addEventListener('beforeunload', () => {
    if (systemThemeMediaQuery.removeEventListener) {
      systemThemeMediaQuery.removeEventListener(
        'change',
        handleSystemThemeChange
      );
    }
    if (systemThemeMediaQuery.removeListener) {
      systemThemeMediaQuery.removeListener(handleSystemThemeChange);
    }

    const notification = document.getElementById('theme-notification') as NotificationElement | null;
    if (notification) {
      if (notification._hideTimeout) {
        window.clearTimeout(notification._hideTimeout);
      }
      notification.classList.remove('is-visible');
    }
  });

  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    window.themeDebug = {
      getState: () => ({
        currentTheme: html.getAttribute('data-theme'),
        userOverride: userManualOverride,
        systemTheme: getSystemTheme(),
        deviceInfo: getDeviceInfo(),
      }),
      forceTheme: (theme: string) => applyTheme(theme, 'debug'),
      resetToSystem: () => {
        userManualOverride = false;
        localStorage.removeItem('theme');
        sessionStorage.removeItem('themeManualOverride');
        applyTheme(getSystemTheme(), 'system');
      },
      showNotification: showThemeNotification,
    };
  }
})();
