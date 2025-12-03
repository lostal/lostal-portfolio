import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lostal.dev',
  output: 'static',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemap()],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: 268402689,
      },
    },
  },
  build: {
    inlineStylesheets: 'always', // Inline pequeños CSS para reducir render-blocking
    assets: '_astro',
  },
  vite: {
    build: {
      cssCodeSplit: true, // Split CSS por página
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          manualChunks(id) {
            // Agrupar swiper en chunk separado para lazy load
            if (id.includes('swiper')) {
              return 'swiper';
            }
          },
        },
      },
    },
  },
});
