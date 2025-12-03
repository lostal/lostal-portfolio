/**
 * Navigation Script
 * Handles: navbar scroll, mobile menu, language switching, smooth scroll
 */

// Navbar scroll effect
const navbar = document.getElementById('navbar');
const scrollDown = document.getElementById('scrollDown');

function isTouchDevice(): boolean {
  return window.matchMedia('(pointer: coarse)').matches;
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

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.setManualNavigation) window.setManualNavigation(true);
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
  langBtn.addEventListener('click', () => {
    // Allow default navigation
    animateIcon();
  });

  // Desktop hover behavior
  if (!isTouchDevice()) {
    langMenu.addEventListener('mouseenter', openMenu);
    langMenu.addEventListener('mouseleave', closeMenu);
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
      const first = langPopover.querySelector('a[data-lang]') as HTMLElement;
      first?.focus();
      openMenu();
    } else if (e.key === 'Escape') {
      closeMenu();
      langBtn.focus();
    }
  });

  // Popover link handlers
  langPopover.querySelectorAll('a[data-lang]').forEach(link => {
    // Just close menu on click, navigation happens naturally
    link.addEventListener('click', () => {
      animateIcon();
      closeMenu();
    });

    link.addEventListener('keydown', (e) => {
      const key = (e as KeyboardEvent).key;

      if (key === 'Escape') {
        e.preventDefault();
        closeMenu();
        langBtn.focus();
        return;
      }

      const items = Array.from(langPopover.querySelectorAll('a[data-lang]')) as HTMLElement[];
      const idx = items.indexOf(link as HTMLElement);

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
    langPopover.querySelectorAll('a[data-lang]').forEach(a => {
      a.classList.toggle('selected', a.getAttribute('data-lang') === current);
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
      if (window.setManualNavigation) window.setManualNavigation(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => { if (window.resetAutoScroll) window.resetAutoScroll(); }, 600);
      return;
    }

    if (window.setManualNavigation) window.setManualNavigation(true);

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
