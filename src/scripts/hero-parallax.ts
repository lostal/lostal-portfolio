/**
 * Hero Sticky Reveal - Efecto de hero fijo con reveal
 * 
 * El hero queda fijo (sticky) mientras la sección de proyectos
 * sube por encima como una cortina, cubriendo el hero.
 * 
 * El hero se desvanece sutilmente al ser cubierto.
 */

class HeroStickyReveal {
    private hero: HTMLElement | null = null;
    private heroInner: HTMLElement | null = null;
    private projects: HTMLElement | null = null;
    private rafId: number | null = null;
    private ticking = false;
    private isEnabled = true;
    private heroHeight = 0;

    constructor() {
        // Respetar preferencias de accesibilidad
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.isEnabled = false;
            return;
        }

        this.init();
    }

    private init(): void {
        if (document.readyState === 'complete') {
            this.setup();
        } else {
            window.addEventListener('load', () => this.setup());
        }
    }

    private setup(): void {
        // Cachear elementos
        this.hero = document.getElementById('hero');
        this.heroInner = document.querySelector('.hero-content');
        this.projects = document.getElementById('projects');

        if (!this.hero || !this.projects) {
            this.isEnabled = false;
            return;
        }

        // Cachear dimensiones
        this.heroHeight = this.hero.offsetHeight;

        this.bindEvents();
    }

    private bindEvents(): void {
        // Scroll con throttling via RAF
        window.addEventListener('scroll', () => this.requestTick(), { passive: true });

        // Resize con debounce
        let resizeTimeout: number | null = null;
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(() => {
                this.heroHeight = this.hero?.offsetHeight || 0;
            }, 150);
        }, { passive: true });
    }

    private requestTick(): void {
        if (!this.ticking && this.isEnabled) {
            this.rafId = requestAnimationFrame(() => this.update());
            this.ticking = true;
        }
    }

    private update(): void {
        this.ticking = false;

        if (!this.heroInner) return;

        const scrollY = window.scrollY;

        // Solo aplicar efecto mientras el hero está parcialmente visible
        if (scrollY > this.heroHeight) {
            return;
        }

        // Calcular cuánto del hero ha sido "cubierto" por projects
        // El fade empieza después del 30% del scroll y termina al 100%
        const fadeStart = this.heroHeight * 0.3;
        const fadeEnd = this.heroHeight;

        if (scrollY <= fadeStart) {
            // Sin fade aún
            this.heroInner.style.opacity = '1';
        } else {
            // Fade progresivo
            const fadeProgress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
            const opacity = 1 - (fadeProgress * 0.7); // No bajar de 0.3
            this.heroInner.style.opacity = `${Math.max(0.3, opacity)}`;
        }
    }

    /**
     * Limpia recursos
     */
    public destroy(): void {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        if (this.heroInner) {
            this.heroInner.style.opacity = '';
        }
    }
}

// Instancia global
let heroStickyReveal: HeroStickyReveal | null = null;

function initHeroStickyReveal(): void {
    if (heroStickyReveal) return;
    heroStickyReveal = new HeroStickyReveal();
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroStickyReveal);
} else {
    initHeroStickyReveal();
}

export { HeroStickyReveal };
