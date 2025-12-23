import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  site: 'https://lostal.dev',
  output: 'static',

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },

  integrations: [
    sitemap(),
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Portafolio | Álvaro Lostal',
        short_name: 'AL Portfolio',
        description: 'Portafolio profesional de Álvaro Lostal',
        theme_color: '#fafaf9',
        background_color: '#fafaf9',
        display: 'standalone',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/android-chrome-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/404',
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
        maximumFileSizeToCacheInBytes: 5_000_000,
      },
      devOptions: { enabled: false },
    }),
  ],

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: { limitInputPixels: 268_402_689 },
    },
  },

  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
  },

  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: { assetFileNames: 'assets/[name]-[hash][extname]' },
      },
    },
  },
});
