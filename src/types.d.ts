/* eslint-disable no-unused-vars */
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
        addListener(_listener: (this: MediaQueryList, _ev: MediaQueryListEvent) => void): void;
        removeListener(_listener: (this: MediaQueryList, _ev: MediaQueryListEvent) => void): void;
    }
}
