/**
 * Constantes centralizadas del proyecto
 * Elimina magic numbers y facilita mantenibilidad
 */

// Thresholds de scroll (en píxeles)
export const SCROLL = {
    /** Distancia para activar estado "scrolled" en navbar */
    NAVBAR_THRESHOLD: 50,
    /** Distancia para ocultar flecha de scroll-down */
    SCROLL_DOWN_HIDE_THRESHOLD: 100,
    /** Offset para scroll suave hacia secciones */
    SMOOTH_SCROLL_OFFSET: 60,
    /** Zona de disparo del auto-scroll */
    AUTO_SCROLL_TRIGGER_ZONE: 150,
    /** Umbral para reset de auto-scroll */
    AUTO_SCROLL_RESET_ZONE: 80,
    /** Delay de inicialización */
    INIT_DELAY_MS: 300,
} as const;

// Dimensiones del card About en Hero
export const HERO_CARD = {
    /** Ancho del card en móvil */
    MOBILE_WIDTH: 360,
    /** Alto del card en móvil */
    MOBILE_HEIGHT: 400,
    /** Ancho del card en desktop */
    DESKTOP_WIDTH: 400,
    /** Margen de seguridad */
    MARGIN: 20,
    /** Margen superior mínimo (debajo de header) */
    MIN_TOP_MARGIN_OFFSET: 20,
} as const;

// Tiempos de animación (en milisegundos)
export const TIMING = {
    /** Duración de la animación de auto-scroll */
    AUTO_SCROLL_DURATION: 800,
    /** Tiempo de reset de navegación manual */
    MANUAL_NAV_RESET_SHORT: 1000,
    MANUAL_NAV_RESET_LONG: 2000,
    /** Debounce de resize */
    RESIZE_DEBOUNCE: 150,
    /** Delay para animaciones de iconos */
    ICON_ANIMATION_DURATION: 580,
    /** Cache de posiciones expira en ms */
    CACHE_EXPIRY: 5000,
} as const;
