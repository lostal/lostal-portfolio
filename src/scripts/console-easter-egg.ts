/** console-easter-egg.ts - ASCII art en consola para curiosos */

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

// Se ejecuta inmediatamente al importarse (importado con requestIdleCallback)
if (typeof window !== 'undefined') {
  console.log('%c' + ASCII_LOGO, STYLES.logo);
  console.log('%c👋 ¡Hola, dev curioso!', STYLES.greeting);
  console.log(
    '%c🔗 Código fuente → https://github.com/lostal/lostal-portfolio',
    STYLES.link
  );
  console.log('%c📧 Contacto → alvaro@lostal.dev', STYLES.link);
}

export {};
