export const SCROLL = {
  /** Distancia para activar estado "scrolled" en navbar */
  NAVBAR_THRESHOLD: 50,
  /** Distancia para ocultar flecha de scroll-down */
  SCROLL_DOWN_HIDE_THRESHOLD: 100,
  /** Offset para scroll suave hacia secciones (navbar ~72px + margen) */
  SMOOTH_SCROLL_OFFSET: 72,
} as const;

export const TIMING = {
  CACHE_EXPIRY: 5000,
} as const;

export const FLOATING_CONTACT = {
  /** Altura aproximada del widget */
  WIDGET_HEIGHT: 72,
  /** Distancia entre el fondo del widget y el borde de la ventana cuando está visible */
  WIDGET_BOTTOM_OFFSET: 37,
  /** Offset para mostrar widget después de proyectos */
  PROJECTS_TRIGGER_OFFSET: 200,
} as const;
