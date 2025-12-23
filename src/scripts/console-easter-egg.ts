/**
 * Console Easter Egg - Developer Console ASCII Art
 * Muestra un mensaje ASCII art estilizado cuando alguien abre DevTools
 */

const ASCII_LOGO = `
   █████╗ ██╗     
  ██╔══██╗██║     
  ███████║██║     
  ██╔══██║██║     
  ██║  ██║███████╗
  ╚═╝  ╚═╝╚══════╝
`;

const STYLES = {
  logo: 'color:#d5bd37; font-size:10px; font-family:monospace; font-weight:bold;',
  greeting: 'font-size:12px; font-family:system-ui;',
  link: 'font-size:12px; font-family:system-ui;',
};

export function initConsoleEasterEgg(): void {
  // Solo ejecutar en navegador
  if (typeof window === 'undefined') return;

  console.log('%c' + ASCII_LOGO, STYLES.logo);
  console.log('%c👋 ¡Hola, dev curioso!', STYLES.greeting);
  console.log(
    '%c🔗 Código fuente → https://github.com/lostal/lostal-portfolio',
    STYLES.link
  );
  console.log('%c📧 Contacto → alvarolostal04@gmail.com', STYLES.link);
}

// Auto-inicializar
initConsoleEasterEgg();
