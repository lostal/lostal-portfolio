/**
 * Detects if the current device is a touch device.
 * Uses matchMedia for modern browsers and falls back to other properties for compatibility.
 */
export function isTouchDevice(): boolean {
    if (typeof window === 'undefined') return false;

    return (
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator.msMaxTouchPoints || 0) > 0
    );
}
