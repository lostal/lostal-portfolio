/**
 * Custom Cursor - Brand Dot
 * A simple accent-colored dot cursor with hover expansion.
 * Features instant tracking and accessibility support.
 */
import { isTouchDevice } from '../utils/dom';

const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Early exit for touch devices or reduced motion
if (!isTouchDevice() && !prefersReducedMotion()) {
  initCustomCursor();
}

function initCustomCursor(): void {
  // Create cursor element
  const cursor = document.createElement('div');
  cursor.className = 'cursor-dot';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cursor);

  // Enable custom cursor mode
  document.documentElement.classList.add('has-custom-cursor');

  // Update cursor position instantly on pointer move
  document.addEventListener('pointermove', (e: PointerEvent) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;

    if (cursor.classList.contains('is-hidden')) {
      cursor.classList.remove('is-hidden');
    }
  });

  document.addEventListener('pointerleave', () => {
    cursor.classList.add('is-hidden');
  });

  document.addEventListener('pointerenter', () => {
    cursor.classList.remove('is-hidden');
  });

  // Interactive elements that should trigger hover state
  const interactiveSelectors = [
    'a',
    'button',
    '[role="button"]',
    'input',
    'textarea',
    'select',
    '.btn',
    '.project-card',
    '.technology-card',
    '.contact-link',
    '.nav-link',
    '.theme-toggle',
    '.timeline-item.card',
  ].join(', ');

  // Navigator cursor for projects carousel
  const carouselZone = document.querySelector('.projects-carousel');
  if (carouselZone) {
    carouselZone.addEventListener(
      'mouseenter',
      () => {
        cursor.classList.add('is-navigating');
      },
      { passive: true }
    );

    carouselZone.addEventListener(
      'mouseleave',
      () => {
        cursor.classList.remove('is-navigating');
      },
      { passive: true }
    );
  }

  // Use event delegation for performance
  document.addEventListener(
    'mouseover',
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(interactiveSelectors)) {
        cursor.classList.add('is-hovering');
      }
    },
    { passive: true }
  );

  document.addEventListener(
    'mouseout',
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const relatedTarget = e.relatedTarget as HTMLElement | null;

      if (
        target.closest(interactiveSelectors) &&
        (!relatedTarget || !relatedTarget.closest(interactiveSelectors))
      ) {
        cursor.classList.remove('is-hovering');
      }
    },
    { passive: true }
  );

  // Handle visibility changes (tab switching)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cursor.classList.add('is-hidden');
    }
  });

  // Listen for reduced motion preference changes
  const reducedMotionQuery = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );
  reducedMotionQuery.addEventListener('change', e => {
    if (e.matches) {
      cursor.remove();
      document.documentElement.classList.remove('has-custom-cursor');
    }
  });
}
