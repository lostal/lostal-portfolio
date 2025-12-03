/**
 * Navigation Script
 * Handles: navbar scroll, mobile menu, language switching, smooth scroll
 */

// Navbar scroll effect
const navbar = document.getElementById('navbar');
const scrollDown = document.getElementById('scrollDown');

function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.innerWidth <= 1024
  );
}

window.addEventListener('scroll', () => {
  const scrollPosition = window.pageYOffset;
  if (navbar) {
    if (isTouchDevice()) {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        const aboutPosition = aboutSection.offsetTop - 100;
        if (scrollPosition >= aboutPosition) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
      }
    } else {
      if (scrollPosition > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
  }
  if (scrollDown) {
    if (scrollPosition > 100) scrollDown.classList.add('hidden');
    else scrollDown.classList.remove('hidden');
  }
});

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    if (navigator.vibrate) navigator.vibrate(50);
  });
}

// Type-safe window access for auto-scroll integration
interface WindowWithAutoScroll {
  setManualNavigation?: (_val: boolean) => void;
  resetAutoScroll?: () => void;
}
const win = window as unknown as WindowWithAutoScroll;

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (win.setManualNavigation) win.setManualNavigation(true);
    if (mobileMenu) mobileMenu.classList.remove('active');
    if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
  });
});

// Language Switcher
const langBtn = document.getElementById('langBtn');
const langPopover = document.getElementById('langPopover');
const langMenu = document.querySelector('.lang-menu') as HTMLElement | null;
const langIcon = document.getElementById('langIcon') as HTMLElement & { _langAnimTimeout?: number };

if (langMenu) langMenu.dataset.ready = '0';

if (langBtn && langPopover && langMenu) {
  // Helper functions
  const closeMenu = () => {
    langBtn.setAttribute('aria-expanded', 'false');
    langMenu.classList.remove('open');
  };

  const openMenu = () => {
    langBtn.setAttribute('aria-expanded', 'true');
    langMenu.classList.add('open');
  };

  // Get current language from URL
  const getCurrentLang = (): 'es' | 'en' => {
    const path = window.location.pathname;
    return path.startsWith('/en/') || path === '/en' ? 'en' : 'es';
  };

  // Navigate to target language
  const navigateToLanguage = (targetLang: string) => {
    const currentLang = getCurrentLang();
    if (targetLang === currentLang) return;

    const hash = window.location.hash;
    const newPath = targetLang === 'en' ? '/en/' : '/';

    // Use full URL to ensure proper navigation
    window.location.href = window.location.origin + newPath + hash;
  };

  // Toggle language
  const toggleLanguage = () => {
    const current = getCurrentLang();
    const next = current === 'es' ? 'en' : 'es';
    navigateToLanguage(next);
    if (navigator.vibrate) navigator.vibrate(20);
  };

  // Animate icon on click
  const animateIcon = () => {
    if (langIcon) {
      langIcon.classList.remove('clicked');
      void langIcon.offsetWidth; // Force reflow
      langIcon.classList.add('clicked');
      if (langIcon._langAnimTimeout) clearTimeout(langIcon._langAnimTimeout);
      langIcon._langAnimTimeout = window.setTimeout(() => langIcon.classList.remove('clicked'), 580);
    }
  };

  // Main button click handler
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    animateIcon();
    toggleLanguage();
  });

  // Desktop hover behavior
  if (!isTouchDevice()) {
    langMenu.addEventListener('mouseenter', closeMenu);
  }

  // Animation end handlers
  if (langIcon) {
    langIcon.addEventListener('animationend', (e) => {
      if (e.animationName?.includes('lang-click-bounce-icon')) {
        langIcon.classList.remove('clicked');
        if (langIcon._langAnimTimeout) clearTimeout(langIcon._langAnimTimeout);
      }
    });
  }

  langBtn.addEventListener('animationend', (e) => {
    if (e.animationName?.includes('lang-click-bounce-icon')) {
      langBtn.classList.remove('clicked');
    }
  });

  // Keyboard navigation for main button
  langBtn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const first = langPopover.querySelector('button[data-lang]') as HTMLElement;
      first?.focus();
      openMenu();
    } else if (e.key === 'Escape') {
      closeMenu();
      langBtn.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      animateIcon();
      toggleLanguage();
    }
  });

  // Popover button handlers
  langPopover.querySelectorAll('button[data-lang]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = btn.getAttribute('data-lang');
      animateIcon();
      if (lang) navigateToLanguage(lang);
      closeMenu();
    });

    btn.addEventListener('keydown', (e) => {
      const key = (e as KeyboardEvent).key;

      if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        const lang = btn.getAttribute('data-lang');
        if (lang) navigateToLanguage(lang);
        closeMenu();
        return;
      }

      const items = Array.from(langPopover.querySelectorAll('button[data-lang]')) as HTMLElement[];
      const idx = items.indexOf(btn as HTMLElement);

      if (key === 'ArrowDown') {
        e.preventDefault();
        items[(idx + 1) % items.length]?.focus();
      } else if (key === 'ArrowUp') {
        e.preventDefault();
        items[(idx - 1 + items.length) % items.length]?.focus();
      } else if (key === 'Home') {
        e.preventDefault();
        items[0]?.focus();
      } else if (key === 'End') {
        e.preventDefault();
        items[items.length - 1]?.focus();
      } else if (key === 'Escape') {
        e.preventDefault();
        closeMenu();
        langBtn.focus();
      }
    });
  });

  // Initialize language state
  (function initLang() {
    const current = getCurrentLang();

    // Update button state
    langBtn.setAttribute('data-lang', current);
    langBtn.setAttribute('aria-label', current === 'es' ? 'Idioma: Español' : 'Language: English');
    langBtn.title = current === 'es' ? 'Español' : 'English';

    // Update popover selection
    langPopover.querySelectorAll('button[data-lang]').forEach(b => {
      b.classList.toggle('selected', b.getAttribute('data-lang') === current);
    });

    // Clean up initial state
    closeMenu();
    langIcon?.classList.remove('clicked');
    langBtn.classList.remove('clicked');

    // Mark as ready after short delay
    setTimeout(() => { langMenu.dataset.ready = '1'; }, 50);
  })();
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();

    const href = anchor.getAttribute('href');

    if (href === '#top') {
      if (win.setManualNavigation) win.setManualNavigation(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => { if (win.resetAutoScroll) win.resetAutoScroll(); }, 600);
      return;
    }

    if (win.setManualNavigation) win.setManualNavigation(true);

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
