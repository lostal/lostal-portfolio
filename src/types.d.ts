export {};

declare global {
  interface Window {
    setManualNavigation?: (isManual: boolean) => void;
    resetAutoScroll?: () => void;
    orientation?: number | string;
  }

  interface Navigator {
    platform: string;
    msMaxTouchPoints?: number;
  }

  interface MediaQueryList {
    addListener(
      _listener: (this: MediaQueryList, _ev: MediaQueryListEvent) => void
    ): void;
    removeListener(
      _listener: (this: MediaQueryList, _ev: MediaQueryListEvent) => void
    ): void;
  }

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
