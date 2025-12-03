const navbar = document.getElementById('navbar');
const scrollDown = document.getElementById('scrollDown');

function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator.msMaxTouchPoints || 0) > 0 ||
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

const langBtn = document.getElementById('langBtn');
const langPopover = document.getElementById('langPopover');
const langMenu = document.querySelector('.lang-menu');
const langIcon = document.getElementById('langIcon');
interface LangIconElement extends HTMLElement {
  _langAnimTimeout?: number | null;
}

if (langMenu) (langMenu as HTMLElement).dataset.ready = '0';
if (langBtn && langPopover && langMenu) {
  const closeMenu = () => {
    langBtn.setAttribute('aria-expanded', 'false');
    langMenu.classList.remove('open');
  };
  const openMenu = () => {
    langBtn.setAttribute('aria-expanded', 'true');
    langMenu.classList.add('open');
  };

  const getCurrentLang = (): 'es' | 'en' => {
    const path = window.location.pathname;
    // Chequear si estamos en /en o /en/
    return path.startsWith('/en/') || path === '/en' ? 'en' : 'es';
  };

  const navigateToLanguage = (targetLang: string) => {
    const currentHash = window.location.hash;
    const currentLang = getCurrentLang();

    // Si ya estamos en el idioma objetivo, no hacer nada
    if (targetLang === currentLang) {
      return;
    }

    let newPath: string;

    if (targetLang === 'en') {
      // Español → Inglés: añadir /en/ al inicio
      newPath = '/en/';
    } else {
      // Inglés → Español: ir a raíz
      newPath = '/';
    }

    // Construir URL completa
    const fullUrl = window.location.origin + newPath + currentHash;

    // Navegar
    window.location.assign(fullUrl);
  };

  const selectNextLanguage = () => {
    const current = getCurrentLang();
    const next = current === 'es' ? 'en' : 'es';
    navigateToLanguage(next);
    if (navigator.vibrate) navigator.vibrate(20);
  };

  langBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (langIcon) {
      const icon = langIcon as LangIconElement;
      icon.classList.remove('clicked');
      void icon.offsetWidth;
      icon.classList.add('clicked');
      if (icon._langAnimTimeout) clearTimeout(icon._langAnimTimeout);
      icon._langAnimTimeout = window.setTimeout(
        () => icon.classList.remove('clicked'),
        580
      );
    }
    selectNextLanguage();
  });

  if (!isTouchDevice || !isTouchDevice()) {
    langMenu.addEventListener('mouseenter', () => {
      closeMenu();
    });
  }

  if (langIcon) {
    langIcon.addEventListener('animationend', e => {
      if (
        e.animationName &&
        (e.animationName.indexOf('lang-click-bounce-icon') >= 0 ||
          e.animationName === 'lang-click-bounce-icon')
      ) {
        const icon = langIcon as LangIconElement;
        icon.classList.remove('clicked');
        if (icon._langAnimTimeout) clearTimeout(icon._langAnimTimeout);
      }
    });
  }
  langBtn.addEventListener('animationend', e => {
    if (
      e.animationName &&
      (e.animationName.indexOf('lang-click-bounce-icon') >= 0 ||
        e.animationName === 'lang-click-bounce-icon')
    )
      langBtn.classList.remove('clicked');
  });

  langBtn.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const first = langPopover.querySelector('button[data-lang]');
      first && (first as HTMLElement).focus();
      openMenu();
    } else if (e.key === 'Escape') {
      closeMenu();
      langBtn.focus();
    } else if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      if (langIcon) {
        const icon = langIcon as LangIconElement;
        icon.classList.remove('clicked');
        void icon.offsetWidth;
        icon.classList.add('clicked');
        if (icon._langAnimTimeout) window.clearTimeout(icon._langAnimTimeout);
        icon._langAnimTimeout = window.setTimeout(
          () => icon.classList.remove('clicked'),
          580
        );
      } else {
        langBtn.classList.remove('clicked');
        void langBtn.offsetWidth;
        langBtn.classList.add('clicked');
      }
      selectNextLanguage();
    }
  });

  langPopover.querySelectorAll('button[data-lang]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const selected = btn.getAttribute('data-lang');
      if (langIcon) {
        const icon = langIcon as LangIconElement;
        icon.classList.remove('clicked');
        void icon.offsetWidth;
        icon.classList.add('clicked');
        if (icon._langAnimTimeout) window.clearTimeout(icon._langAnimTimeout);
        icon._langAnimTimeout = window.setTimeout(
          () => icon.classList.remove('clicked'),
          580
        );
      } else {
        langBtn.classList.remove('clicked');
        void langBtn.offsetWidth;
        langBtn.classList.add('clicked');
      }
      if (selected) navigateToLanguage(selected);
      closeMenu();
    });
    btn.addEventListener('keydown', e => {
      if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ' || (e as KeyboardEvent).key === 'Spacebar') {
        e.preventDefault();
        const selected = btn.getAttribute('data-lang');
        if (selected) navigateToLanguage(selected);
        closeMenu();
        return;
      }
      const items = Array.from(
        langPopover.querySelectorAll('button[data-lang]')
      );
      const idx = items.indexOf(btn);
      if ((e as KeyboardEvent).key === 'ArrowDown') {
        e.preventDefault();
        const next = items[(idx + 1) % items.length];
        next && (next as HTMLElement).focus();
      } else if ((e as KeyboardEvent).key === 'ArrowUp') {
        e.preventDefault();
        const prev = items[(idx - 1 + items.length) % items.length];
        prev && (prev as HTMLElement).focus();
      } else if ((e as KeyboardEvent).key === 'Home') {
        e.preventDefault();
        items[0] && (items[0] as HTMLElement).focus();
      } else if ((e as KeyboardEvent).key === 'End') {
        e.preventDefault();
        items[items.length - 1] && (items[items.length - 1] as HTMLElement).focus();
      } else if ((e as KeyboardEvent).key === 'Escape') {
        e.preventDefault();
        closeMenu();
        langBtn.focus();
      }
    });
  });

  (function initLang() {
    const current = getCurrentLang();
    langBtn.setAttribute('data-lang', current);
    if (current === 'es') {
      langBtn.setAttribute('aria-label', 'Idioma: Español');
      langBtn.title = 'Español';
    } else {
      langBtn.setAttribute('aria-label', 'Language: English');
      langBtn.title = 'English';
    }

    try {
      const items = langPopover.querySelectorAll('button[data-lang]');
      items.forEach(b => {
        if (b.getAttribute('data-lang') === current) b.classList.add('selected');
        else b.classList.remove('selected');
      });
    } catch {
      // Element not found
    }

    try {
      closeMenu();
    } catch {
      // closeMenu not available
    }
    try {
      if (typeof langBtn.blur === 'function') langBtn.blur();
    } catch {
      // Blur not available
    }
    try {
      langIcon && langIcon.classList.remove('clicked');
    } catch {
      // langIcon not available
    }
    try {
      langBtn && langBtn.classList.remove('clicked');
    } catch {
      // langBtn not available
    }
    try {
      setTimeout(() => {
        (langMenu as HTMLElement).dataset.ready = '1';
      }, 50);
    } catch {
      // setTimeout not available
    }
  })();
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();

    const href = anchor.getAttribute('href');

    if (href === '#top') {
      if (window.setManualNavigation) {
        window.setManualNavigation(true);
      }

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      setTimeout(() => {
        if (window.resetAutoScroll) {
          window.resetAutoScroll();
        }
      }, 600);

      return;
    }

    if (window.setManualNavigation) {
      window.setManualNavigation(true);
    }

    if (href) {
      const target = document.querySelector(href);
      if (target) {
        const offset = 60;
        const targetPosition = (target as HTMLElement).offsetTop - offset;

        requestAnimationFrame(() => {
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        });
      }
    }
  });
});
