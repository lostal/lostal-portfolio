const navbar = document.getElementById('navbar');
const scrollDown = document.getElementById('scrollDown');
// detector táctil
function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0 ||
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
if (langMenu) langMenu.dataset.ready = '0';
if (langBtn && langPopover && langMenu) {
  const closeMenu = () => {
    langBtn.setAttribute('aria-expanded', 'false');
    langMenu.classList.remove('open');
  };
  const openMenu = () => {
    langBtn.setAttribute('aria-expanded', 'true');
    langMenu.classList.add('open');
  };

  const getCurrentLang = () => {
    const path = window.location.pathname;
    return path.startsWith('/en') ? 'en' : 'es';
  };

  const navigateToLanguage = lang => {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    let newPath;

    if (lang === 'en') {
      // Cambiar a inglés
      if (currentPath === '/' || currentPath === '') {
        newPath = '/en/' + currentHash;
      } else if (!currentPath.startsWith('/en')) {
        newPath = '/en' + currentPath + currentHash;
      } else {
        return; // Ya está en inglés
      }
    } else {
      // Cambiar a español
      if (currentPath.startsWith('/en')) {
        newPath = currentPath.replace(/^\/en/, '') || '/';
        newPath += currentHash;
      } else {
        return; // Ya está en español
      }
    }

    window.location.href = newPath;
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
      langIcon.classList.remove('clicked');
      void langIcon.offsetWidth;
      langIcon.classList.add('clicked');
      clearTimeout(langIcon._langAnimTimeout);
      langIcon._langAnimTimeout = setTimeout(
        () => langIcon.classList.remove('clicked'),
        580
      );
    }
    // Siempre cambiar el idioma al hacer clic en el icono
    selectNextLanguage();
  });

  // En desktop con hover, remover la clase .open cuando el ratón entre
  // para que el hover tome control completo
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
        langIcon.classList.remove('clicked');
        clearTimeout(langIcon._langAnimTimeout);
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
      first && first.focus();
      openMenu();
    } else if (e.key === 'Escape') {
      closeMenu();
      langBtn.focus();
    } else if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      if (langIcon) {
        langIcon.classList.remove('clicked');
        void langIcon.offsetWidth;
        langIcon.classList.add('clicked');
        clearTimeout(langIcon._langAnimTimeout);
        langIcon._langAnimTimeout = setTimeout(
          () => langIcon.classList.remove('clicked'),
          580
        );
      } else {
        langBtn.classList.remove('clicked');
        void langBtn.offsetWidth;
        langBtn.classList.add('clicked');
      }
      // Siempre cambiar el idioma al presionar Enter/Space
      selectNextLanguage();
    }
  });

  langPopover.querySelectorAll('button[data-lang]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const selected = btn.getAttribute('data-lang');
      if (langIcon) {
        langIcon.classList.remove('clicked');
        void langIcon.offsetWidth;
        langIcon.classList.add('clicked');
        clearTimeout(langIcon._langAnimTimeout);
        langIcon._langAnimTimeout = setTimeout(
          () => langIcon.classList.remove('clicked'),
          580
        );
      } else {
        langBtn.classList.remove('clicked');
        void langBtn.offsetWidth;
        langBtn.classList.add('clicked');
      }
      navigateToLanguage(selected);
      closeMenu();
    });
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        const selected = btn.getAttribute('data-lang');
        navigateToLanguage(selected);
        closeMenu();
        return;
      }
      const items = Array.from(
        langPopover.querySelectorAll('button[data-lang]')
      );
      const idx = items.indexOf(btn);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = items[(idx + 1) % items.length];
        next && next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = items[(idx - 1 + items.length) % items.length];
        prev && prev.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        items[0] && items[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        items[items.length - 1] && items[items.length - 1].focus();
      } else if (e.key === 'Escape') {
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

    // Update visual selection inside the popover
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
        langMenu.dataset.ready = '1';
      }, 50);
    } catch {
      // setTimeout not available
    }
  })();
}

// Smooth scroll mejorado
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();

    const href = anchor.getAttribute('href');

    // Tratamiento especial para el logo AL
    if (href === '#top') {
      // Notificar al auto-scroll
      if (window.setManualNavigation) {
        window.setManualNavigation(true);
      }

      // Scroll al top
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      // Resetear el auto-scroll después de llegar al top
      setTimeout(() => {
        if (window.resetAutoScroll) {
          window.resetAutoScroll();
        }
      }, 600);

      return;
    }

    // Para otros enlaces, comportamiento normal
    if (window.setManualNavigation) {
      window.setManualNavigation(true);
    }

    if (href) {
      const target = document.querySelector(href);
      if (target) {
        const offset = 60;
        const targetPosition = target.offsetTop - offset;

        // Usar requestAnimationFrame para asegurar que setManualNavigation se ejecute primero
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
