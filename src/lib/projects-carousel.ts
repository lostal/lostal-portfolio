import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface CarouselElement extends HTMLElement {
  swiperInstance?: Swiper | null;
  _keyNavigationHandler?: ((_e: KeyboardEvent) => void) | null;
  destroy?: () => void;
}

/**
 * Actualiza las líneas táctiles del carrusel
 */
function updateLines(carousel: HTMLElement, activeIndex: number): void {
  const lines = carousel.querySelectorAll('.carousel-line');

  lines.forEach((line, index) => {
    const isActive = index === activeIndex;
    line.classList.toggle('is-active', isActive);
    line.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

/**
 * Inicializa el carrusel de proyectos usando Swiper
 */
function initProjectsCarousel(): Swiper | null {
  const carousel = document.querySelector(
    '.projects-carousel'
  ) as CarouselElement | null;
  if (!carousel) return null;

  if (carousel.swiperInstance) {
    return carousel.swiperInstance;
  }

  const slider = carousel.querySelector('.swiper');
  const lines = carousel.querySelectorAll('.carousel-line');

  const swiper = new Swiper(slider as HTMLElement, {
    modules: [Navigation],
    slidesPerView: 1.3,
    spaceBetween: 24,
    speed: 500,
    centeredSlides: true,
    initialSlide: 0,
    loop: false,
    grabCursor: true,
    breakpoints: {
      375: {
        slidesPerView: 1.4,
        spaceBetween: 20,
      },
      480: {
        slidesPerView: 1.5,
        spaceBetween: 24,
      },
      640: {
        slidesPerView: 2.0,
        spaceBetween: 28,
      },
      768: {
        slidesPerView: 2.2,
        spaceBetween: 32,
      },
      1024: {
        slidesPerView: 2.6,
        spaceBetween: 36,
      },
      1280: {
        slidesPerView: 2.8,
        spaceBetween: 40,
      },
      1440: {
        slidesPerView: 3.0,
        spaceBetween: 44,
      },
      1920: {
        slidesPerView: 4.0,
        spaceBetween: 48,
      },
      2400: {
        slidesPerView: 5.0,
        spaceBetween: 52,
      },
    },
  });

  carousel.swiperInstance = swiper;

  // Inicializar líneas
  updateLines(carousel, swiper.activeIndex);

  // Sincronizar al cambiar de slide
  swiper.on('slideChange', () => {
    updateLines(carousel, swiper.activeIndex);
  });

  // Hacer las líneas clickeables
  lines.forEach((line, index) => {
    line.addEventListener('click', () => {
      swiper.slideTo(index);
    });
  });

  const handleKeyNavigation = (e: KeyboardEvent) => {
    const carouselHasFocus =
      carousel.contains(document.activeElement) ||
      document.activeElement === carousel;

    if (!carouselHasFocus) return;

    if (e.key === 'ArrowLeft' || e.key === 'Left') {
      e.preventDefault();
      swiper.slidePrev();
    } else if (e.key === 'ArrowRight' || e.key === 'Right') {
      e.preventDefault();
      swiper.slideNext();
    }
  };

  if (carousel._keyNavigationHandler) {
    document.removeEventListener('keydown', carousel._keyNavigationHandler);
  }

  carousel._keyNavigationHandler = handleKeyNavigation;
  document.addEventListener('keydown', handleKeyNavigation);

  if (!carousel.hasAttribute('tabindex')) {
    carousel.setAttribute('tabindex', '0');
  }

  carousel.destroy = () => {
    if (carousel._keyNavigationHandler) {
      document.removeEventListener('keydown', carousel._keyNavigationHandler);
      carousel._keyNavigationHandler = null;
    }
    if (carousel.swiperInstance) {
      carousel.swiperInstance.destroy(true, true);
      carousel.swiperInstance = null;
    }
  };

  // Create debounce utility
  const debounce = (fn: Function, ms: number) => {
    let timeoutId: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => fn.apply(null, args), ms);
    };
  };

  const updateCarouselHeight = () => {
    if (!carousel || !swiper) return;

    // Reset min-height to allow natural recalculation if needed (though we usually grow)
    // We modify the slides directly.
    const slides = carousel.querySelectorAll<HTMLElement>(
      '.projects-carousel__slide'
    );
    if (!slides.length) return;

    let maxRequiredHeight = 0;

    slides.forEach(slide => {
      // Find the inner card content parts
      const image = slide.querySelector<HTMLElement>('.carousel-item__image');
      const content = slide.querySelector<HTMLElement>(
        '.carousel-item__content'
      );

      // We look for the "inner" parts that always have natural height
      // The structure is: .carousel-item__header > .carousel-item__header-inner
      // .carousel-item__footer > .carousel-item__actions (or just the footer inner content)

      // Note: In the HTML, .carousel-item__actions is direct child of .carousel-item__footer?
      // Let's verify structure from Projects.astro:
      // <div class="carousel-item__header"><div class="carousel-item__header-inner">...</div></div>
      // <div class="carousel-item__info">...</div>
      // <div class="carousel-item__footer"><div class="carousel-item__actions">...</div></div>

      const headerInner = slide.querySelector<HTMLElement>(
        '.carousel-item__header-inner'
      );
      const info = slide.querySelector<HTMLElement>('.carousel-item__info');
      const footerActions = slide.querySelector<HTMLElement>(
        '.carousel-item__actions'
      );

      if (image && content && headerInner && info && footerActions) {
        // Measure heights
        const imgH = image.offsetHeight; // Aspect ratio ensures this is correct even if loading

        // Measure content spacing
        const contentStyle = window.getComputedStyle(content);
        const paddingAndGap =
          parseFloat(contentStyle.paddingTop || '0') +
          parseFloat(contentStyle.paddingBottom || '0') +
          parseFloat(contentStyle.rowGap || '0') * 2; // 2 gaps for 3 items

        // Sum execution
        const totalH =
          imgH +
          paddingAndGap +
          headerInner.offsetHeight +
          info.offsetHeight +
          footerActions.offsetHeight;

        if (totalH > maxRequiredHeight) {
          maxRequiredHeight = totalH;
        }
      }
    });

    if (maxRequiredHeight > 0) {
      // Add a small safety buffer (e.g. border width usually 2px top/bottom = 4px)
      const buffer = 4;
      const finalHeight = maxRequiredHeight + buffer;

      slides.forEach(slide => {
        slide.style.minHeight = `${finalHeight}px`;
      });

      // Also update the wrapper/container if needed?
      // Swiper usually handles wrapper height if slides are sized.
      // But the container .projects-carousel has a min-height too.
      // We should probably let that be handled by CSS or update it too.
      // Usually setting slide height is enough.
    }
  };

  // Run initial calculation
  // We use requestAnimationFrame to ensure styles (computed values) are ready
  requestAnimationFrame(() => {
    updateCarouselHeight();
    // Re-run after a short delay in case of font loading layout shifts,
    // although standard fonts usually don't shift height much.
    setTimeout(updateCarouselHeight, 500);
  });

  // Listener for resize
  const debouncedResize = debounce(updateCarouselHeight, 200);
  window.addEventListener('resize', debouncedResize);

  carousel.destroy = () => {
    window.removeEventListener('resize', debouncedResize);
    if (carousel._keyNavigationHandler) {
      document.removeEventListener('keydown', carousel._keyNavigationHandler);
      carousel._keyNavigationHandler = null;
    }
    if (carousel.swiperInstance) {
      carousel.swiperInstance.destroy(true, true);
      carousel.swiperInstance = null;
    }
  };

  return swiper;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initProjectsCarousel();
  });
} else {
  initProjectsCarousel();
}
