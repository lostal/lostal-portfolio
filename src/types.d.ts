/**
 * Declaraciones de tipos globales para el proyecto.
 * Extiende las interfaces nativas del navegador con funcionalidades custom.
 */
export {};

import type Lenis from 'lenis';

declare global {
  /** Propiedades custom añadidas al objeto Window */
  interface Window {
    setManualNavigation?: (isManual: boolean) => void;
    resetAutoScroll?: () => void;
    orientation?: number | string;
    lenis: Lenis | null;
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
