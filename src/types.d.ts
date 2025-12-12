export { };

declare global {
  interface DeviceInfo {
    deviceType: 'mobile' | 'tablet' | 'desktop';
    operatingSystem: string;
    touchScreen: boolean;
    orientation: boolean;
    isMobile: boolean;
  }

  interface Window {
    themeDebug?: {
      getState: () => {
        currentTheme: string | null;
        userOverride: boolean;
        systemTheme: string;
        deviceInfo: DeviceInfo;
      };
      forceTheme: (theme: string) => void;
      resetToSystem: () => void;
      showNotification: (message: string) => void;
    };
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

  // View Transitions API types
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
