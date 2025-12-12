/**
 * Tipos globales del proyecto
 * Declaraciones de Window extendidas para scripts personalizados
 */

import type Lenis from 'lenis';

declare global {
    interface Window {
        // Lenis smooth scroll
        lenis: Lenis | null;
    }
}

export { };
