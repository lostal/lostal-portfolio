import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface CarouselElement extends HTMLElement {
  swiperInstance?: Swiper | null;
  // eslint-disable-next-line no-unused-vars
  _keyNavigationHandler?: ((_e: KeyboardEvent) => void) | null;
  destroy?: () => void;
}

/**
 * Inicializa el carrusel de proyectos usando Swiper
 */
function initProjectsCarousel(): Swiper | null {
  const carousel = document.querySelector('.projects-carousel') as CarouselElement | null;
  if (!carousel) return null;

  if (carousel.swiperInstance) {
    return carousel.swiperInstance;
  }

  const slider = carousel.querySelector('.swiper');
  const prevEl = carousel.querySelector('.slider-nav__item_prev');
  const nextEl = carousel.querySelector('.slider-nav__item_next');

  const swiper = new Swiper(slider as HTMLElement, {
    modules: [Navigation],
    slidesPerView: 1.3,
    spaceBetween: 24,
    speed: 500,
    centeredSlides: true,
    initialSlide: 0,
    loop: false,
    grabCursor: true,
    navigation: {
      nextEl: nextEl as HTMLElement,
      prevEl: prevEl as HTMLElement,
      disabledClass: 'disabled',
    },
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
        slidesPerView: 3.2,
        spaceBetween: 48,
      },
      2400: {
        slidesPerView: 3.4,
        spaceBetween: 52,
      },
    },
  });

  carousel.swiperInstance = swiper;

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

  return swiper;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initProjectsCarousel();
  });
} else {
  initProjectsCarousel();
}
