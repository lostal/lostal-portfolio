/**
 * Helper de inicialización para scripts
 * Estandariza el patrón de espera al DOM ready
 */

/**
 * Ejecuta una función cuando el DOM está listo
 * Soporta tanto carga inicial como scripts diferidos
 */
export function onReady(fn: () => void): void {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
        fn();
    }
}

/**
 * Ejecuta una función cuando la página está completamente cargada
 * (incluidos estilos, imágenes, etc.)
 */
export function onLoad(fn: () => void): void {
    if (document.readyState === 'complete') {
        fn();
    } else {
        window.addEventListener('load', fn, { once: true });
    }
}
