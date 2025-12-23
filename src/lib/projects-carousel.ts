/** projects-carousel.ts - Carrusel de proyectos con Swiper */

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
    speed: 400,
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

  // Utilidad debounce con tipado genérico
  const debounce = <T extends (...args: Parameters<T>) => void>(
    fn: T,
    ms: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: number;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => fn(...args), ms);
    };
  };

  const updateCarouselHeight = () => {
    if (!carousel || !swiper) return;

    const slides = carousel.querySelectorAll<HTMLElement>(
      '.projects-carousel__slide'
    );
    if (!slides.length) return;

    let maxRequiredHeight = 0;

    slides.forEach(slide => {
      // Encontrar las partes del contenido de la card
      const image = slide.querySelector<HTMLElement>('.carousel-item__image');
      const content = slide.querySelector<HTMLElement>(
        '.carousel-item__content'
      );

      // Estructura del HTML:
      // .carousel-item__header > .carousel-item__header-inner
      // .carousel-item__info
      // .carousel-item__footer > .carousel-item__actions

      const headerInner = slide.querySelector<HTMLElement>(
        '.carousel-item__header-inner'
      );
      const info = slide.querySelector<HTMLElement>('.carousel-item__info');
      const footerActions = slide.querySelector<HTMLElement>(
        '.carousel-item__actions'
      );

      if (image && content && headerInner && info && footerActions) {
        // Medir alturas
        const imgH = image.offsetHeight;

        // Medir espaciado del contenido
        const contentStyle = window.getComputedStyle(content);
        const paddingAndGap =
          parseFloat(contentStyle.paddingTop || '0') +
          parseFloat(contentStyle.paddingBottom || '0') +
          parseFloat(contentStyle.rowGap || '0') * 2; // 2 gaps para 3 items

        // Sumar todo
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
      // Añadir buffer de seguridad (ej: borde 2px top/bottom = 4px)
      const buffer = 4;
      const finalHeight = maxRequiredHeight + buffer;

      slides.forEach(slide => {
        slide.style.minHeight = `${finalHeight}px`;
      });
    }
  };

  // Ejecutar cálculo inicial
  requestAnimationFrame(() => {
    updateCarouselHeight();
    // Re-ejecutar después de un delay por si hay cambios de layout por carga de fuentes
    setTimeout(updateCarouselHeight, 500);
  });

  // Listener para resize
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
