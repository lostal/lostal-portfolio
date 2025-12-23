/** animations.ts - Fade-in con IntersectionObserver y efecto stagger */

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
};

const staggerMap = new WeakMap<Element, number>();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target as HTMLElement;
      const parent = el.parentElement;

      if (parent) {
        const staggerIndex = staggerMap.get(parent) || 0;
        el.style.transitionDelay = `${staggerIndex * 80}ms`;
        staggerMap.set(parent, staggerIndex + 1);
      }

      el.classList.add('visible');
      observer.unobserve(el);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
