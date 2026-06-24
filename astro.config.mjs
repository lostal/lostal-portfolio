import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Configuración principal de Astro
 * @see https://docs.astro.build/es/reference/configuration-reference/
 */
export default defineConfig({
  // URL del sitio en producción
  site: 'https://lostal.dev',
  output: 'static',

  // Configuración de internacionalización
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },

  // Integraciones
  integrations: [sitemap()],

  // Configuración de imágenes
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: { limitInputPixels: 268_402_689 },
    },
  },

  // Compresión HTML (mantener comportamiento v6: compresión HTML-aware)
  compressHTML: true,

  // Configuración de build
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
  },

  // Configuración de Vite
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: { assetFileNames: 'assets/[name]-[hash][extname]' },
      },
    },
  },
});
