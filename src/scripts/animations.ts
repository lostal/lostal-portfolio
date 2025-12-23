// Animaciones de fade-in con Intersection Observer + Staggered Effect
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
};

// Mapa para trackear parents y aplicar stagger
const staggerMap = new WeakMap<Element, number>();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target as HTMLElement;

      // Buscar si está dentro de un contenedor con múltiples elementos animados
      const parent = el.parentElement;
      if (parent) {
        // Obtener índice para stagger dentro del padre
        const staggerIndex = staggerMap.get(parent) || 0;

        // Aplicar delay staggered: 80ms entre cada elemento
        el.style.transitionDelay = `${staggerIndex * 80}ms`;
        staggerMap.set(parent, staggerIndex + 1);
      }

      el.classList.add('visible');
      // Dejar de observar una vez visible para liberar memoria
      observer.unobserve(el);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

