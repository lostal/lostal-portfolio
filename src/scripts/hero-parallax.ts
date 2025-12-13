/**
 * Hero Cinematic Zoom Out - Efecto dramático de scroll
 * 
 * Al scrollear, el hero:
 * - Se encoge (scale down) alejándose
 * - Sube ligeramente (translateY) reforzando el alejamiento
 * - Se desenfoca (blur) creando profundidad
 * - Se desvanece (opacity)
 * 
 * Efecto cinematográfico con curva ease-out (empieza rápido, termina suave)
 */

class HeroCinematicZoom {
    private hero: HTMLElement | null = null;
    private heroContent: HTMLElement | null = null;
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
        this.hero = document.getElementById('hero');
        this.heroContent = document.querySelector('.hero-content');

        if (!this.hero || !this.heroContent) {
            this.isEnabled = false;
            return;
        }

        this.heroHeight = this.hero.offsetHeight;
        this.bindEvents();
    }

    private bindEvents(): void {
        window.addEventListener('scroll', () => this.requestTick(), { passive: true });

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

    /**
     * Curva ease-out: empieza rápido, termina suave
     * t^0.6 da una curva más pronunciada al inicio
     */
    private easeOut(t: number): number {
        return 1 - Math.pow(1 - t, 2.5);
    }

    private update(): void {
        this.ticking = false;

        if (!this.heroContent) return;

        const scrollY = window.scrollY;

        // Solo aplicar mientras el hero es visible
        if (scrollY > this.heroHeight) {
            return;
        }

        // Progreso lineal del scroll (0 = top, 1 = 70% del hero scrolleado)
        const linearProgress = Math.min(scrollY / (this.heroHeight * 0.7), 1);

        // Aplicar curva ease-out para mayor impacto inicial
        const progress = this.easeOut(linearProgress);

        // ZOOM OUT CINEMATOGRÁFICO
        // Scale: 1 → 0.85 (se encoge un 15%)
        const scale = 1 - (progress * 0.15);

        // Blur: 0 → 8px (desenfoque progresivo)
        const blur = progress * 8;

        // Opacity: 1 → 0.1 (casi desaparece)
        const opacity = 1 - (progress * 0.9);

        // Aplicar transformaciones
        this.heroContent.style.transform = `scale(${scale})`;
        this.heroContent.style.filter = `blur(${blur}px)`;
        this.heroContent.style.opacity = `${Math.max(0.1, opacity)}`;
    }

    public destroy(): void {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        if (this.heroContent) {
            this.heroContent.style.transform = '';
            this.heroContent.style.filter = '';
            this.heroContent.style.opacity = '';
        }
    }
}

let heroCinematicZoom: HeroCinematicZoom | null = null;

function initHeroCinematicZoom(): void {
    if (heroCinematicZoom) return;
    heroCinematicZoom = new HeroCinematicZoom();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroCinematicZoom);
} else {
    initHeroCinematicZoom();
}

export { HeroCinematicZoom };
