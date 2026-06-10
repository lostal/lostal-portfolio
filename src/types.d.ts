/**
 * Declaraciones de tipos globales para el proyecto.
 * Extiende las interfaces nativas del navegador con funcionalidades custom.
 */
export {};

declare global {
  /** Propiedades custom añadidas al objeto Window */
  interface Window {
    setManualNavigation?: (isManual: boolean) => void;
    resetAutoScroll?: () => void;
    orientation?: number | string;
    lenis: LenisInstance | null;
  }

  /** Tipo para View Transitions API (experimental) */
  interface ViewTransition {
    ready: Promise<void>;
    finished: Promise<void>;
    updateCallbackDone: Promise<void>;
    skipTransition(): void;
  }

  interface Document {
    startViewTransition?(callback: () => void | Promise<void>): ViewTransition;
  }
}

interface LenisInstance {
  raf(time: number): void;
  destroy(): void;
  scrollTo(
    target: number | string | HTMLElement,
    options?: Record<string, unknown>
  ): void;
}
