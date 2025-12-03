// src/scripts/auto-scroll.js
class AutoScrollManager {
  isAutoScrolling: boolean;
  isManualNavigation: boolean;
  hasTriggeredAutoScroll: boolean;
  isInitialized: boolean;
  scrollTimeout: number | null;
  wheelTimeout: number | null;
  lastScrollY: number;
  consecutiveScrollDown: number;
  isTouchDevice: boolean;

  constructor() {
    this.isAutoScrolling = false;
    this.isManualNavigation = false;
    this.hasTriggeredAutoScroll = false;
    this.isInitialized = false;
    this.scrollTimeout = null;
    this.wheelTimeout = null;
    this.lastScrollY = window.scrollY;
    this.consecutiveScrollDown = 0;

    this.isTouchDevice = this.detectTouchDevice();

    if (this.isTouchDevice) {
      return;
    }
    this.init();
  }

  detectTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator.msMaxTouchPoints || 0) > 0 ||
      window.innerWidth <= 1024 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }

  init() {
    if (document.readyState === 'complete') {
      this.delayedInit();
    } else {
      window.addEventListener('load', () => this.delayedInit());
    }
  }

  delayedInit() {
    setTimeout(() => {
      this.isInitialized = true;
      this.bindEvents();
    }, 300);
  }

  bindEvents() {
    const wheelHandler = (e: Event) => this.handleWheel(e as WheelEvent);

    window.addEventListener('wheel', wheelHandler, {
      passive: false,
      capture: true,
    });
    document.addEventListener('wheel', wheelHandler, {
      passive: false,
      capture: true,
    });

    window.addEventListener('scroll', () => this.handleScroll(), {
      passive: true,
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => this.handleKeyNavigation(e));
    document.addEventListener('click', (e: MouseEvent) => this.handleLinkClick(e));
  }

  autoScrollToProjects() {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection || this.hasTriggeredAutoScroll) {
      return;
    }

    this.isAutoScrolling = true;
    this.hasTriggeredAutoScroll = true;

    this.clearTimeouts();

    const projectsPosition =
      projectsSection.getBoundingClientRect().top + window.scrollY;
    const offset = 60;

    window.scrollTo({
      top: projectsPosition - offset,
      behavior: 'smooth',
    });

    this.scrollTimeout = window.setTimeout(() => {
      this.isAutoScrolling = false;

      setTimeout(() => {
        if (window.scrollY < 100) {
          this.hasTriggeredAutoScroll = false;
        }
      }, 500);
    }, 1200);
  }

  clearTimeouts() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }
    if (this.wheelTimeout) {
      clearTimeout(this.wheelTimeout);
      this.wheelTimeout = null;
    }
  }

  handleScroll() {
    if (!this.isInitialized || this.isAutoScrolling) return;

    const currentScrollY = window.scrollY;

    if (currentScrollY < 50 && this.hasTriggeredAutoScroll) {
      this.hasTriggeredAutoScroll = false;
      this.consecutiveScrollDown = 0;

      if (this.isManualNavigation) {
        this.isManualNavigation = false;
      }
    }

    this.lastScrollY = currentScrollY;
  }

  handleWheel(e: WheelEvent) {
    const currentScrollY = window.scrollY;

    if (e.deltaY > 0 && currentScrollY <= 150 && !this.hasTriggeredAutoScroll) {
      if (!this.isInitialized || this.isAutoScrolling) {
        return;
      }

      if (this.isManualNavigation && currentScrollY < 80) {
        this.isManualNavigation = false;
      }

      if (this.isManualNavigation) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      this.executeImmediateAutoScroll();
      return false;
    }
  }

  executeImmediateAutoScroll() {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) {
      return;
    }

    this.isAutoScrolling = true;
    this.hasTriggeredAutoScroll = true;

    this.clearTimeouts();

    const rect = projectsSection.getBoundingClientRect();
    const targetPosition = window.scrollY + rect.top - 60;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });

    this.scrollTimeout = window.setTimeout(() => {
      this.isAutoScrolling = false;
    }, 800);
  }

  handleKeyNavigation(e: KeyboardEvent) {
    const navigationKeys = [
      'PageDown',
      'PageUp',
      'Home',
      'End',
      'ArrowDown',
      'ArrowUp',
      'Space',
    ];

    if (navigationKeys.includes(e.code)) {
      const currentScrollY = window.scrollY;

      if (
        e.code === 'ArrowDown' &&
        currentScrollY < 80 &&
        !this.hasTriggeredAutoScroll &&
        this.isInitialized &&
        !this.isAutoScrolling &&
        !this.isManualNavigation
      ) {
        e.preventDefault();
        this.autoScrollToProjects();
      } else {
        this.setManualNavigation(true);
      }
    }
  }

  handleLinkClick(e: MouseEvent) {
    const target = (e.target as HTMLElement).closest('a[href^="#"]');
    if (target) {
      const href = target.getAttribute('href');

      if (href === '#top') {
        this.setManualNavigation(true);

        setTimeout(() => {
          if (window.scrollY < 100) {
            this.hasTriggeredAutoScroll = false;
            this.isManualNavigation = false;
          }
        }, 800);
      } else {
        this.setManualNavigation(true);
      }
    }
  }

  setManualNavigation(isManual: boolean) {
    this.isManualNavigation = isManual;

    if (isManual) {
      this.clearTimeouts();

      const resetTime = window.scrollY < 100 ? 1000 : 2000;

      setTimeout(() => {
        this.isManualNavigation = false;
      }, resetTime);
    }
  }
}

let autoScrollManager: AutoScrollManager | null = null;

window.setManualNavigation = function (isManual: boolean) {
  if (autoScrollManager) {
    autoScrollManager.setManualNavigation(isManual);
  }
};

window.resetAutoScroll = function () {
  if (autoScrollManager) {
    autoScrollManager.hasTriggeredAutoScroll = false;
    autoScrollManager.isManualNavigation = false;
    autoScrollManager.consecutiveScrollDown = 0;
  }
};

function initAutoScrollManager() {
  if (autoScrollManager) {
    return;
  }
  autoScrollManager = new AutoScrollManager();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAutoScrollManager);
} else {
  setTimeout(initAutoScrollManager, 100);
}
