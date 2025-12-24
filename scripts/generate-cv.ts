/**
 * Script de generación automática de CV en PDF (multi-idioma)
 * Ejecutado automáticamente después de cada build de producción
 * Genera cv-es.pdf y cv-en.pdf
 *
 * Uso: npx tsx scripts/generate-cv.ts
 */

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import handler from 'serve-handler';
import puppeteer from 'puppeteer';

// Idiomas soportados
const LANGUAGES = ['es', 'en'] as const;

// Configuración
const CONFIG = {
  buildDir: path.join(process.cwd(), 'dist'),
  publicDir: path.join(process.cwd(), 'public'),
  cvRouteBase: '/cv-print',
  port: 8080,
  timeout: 60000,
} as const;

/**
 * Busca un puerto disponible empezando desde el especificado
 */
async function findAvailablePort(startPort: number): Promise<number> {
  return new Promise(resolve => {
    const server = http.createServer();
    server.listen(startPort, () => {
      const { port } = server.address() as { port: number };
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

/**
 * Inicia un servidor estático para servir el build
 */
function startServer(port: number): http.Server {
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: CONFIG.buildDir,
      cleanUrls: true,
    });
  });

  server.listen(port);
  return server;
}

/**
 * Genera los PDFs del CV en todos los idiomas usando Puppeteer
 */
async function generatePDFs(): Promise<void> {
  // Verificar que existe el directorio de build
  if (!fs.existsSync(CONFIG.buildDir)) {
    console.error(`❌ Error: No existe el directorio '${CONFIG.buildDir}'`);
    console.error('   Ejecuta primero: pnpm astro build');
    process.exit(1);
  }

  const port = await findAvailablePort(CONFIG.port);
  const server = startServer(port);

  console.log(`🌐 Servidor iniciado en http://localhost:${port}`);

  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    // Lanzar navegador headless
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Generar PDF para cada idioma
    for (const lang of LANGUAGES) {
      const cvUrl = `http://localhost:${port}${CONFIG.cvRouteBase}/${lang}`;
      const outputPath = path.join(CONFIG.buildDir, `cv-${lang}.pdf`);

      console.log(`📄 Generando CV (${lang}): ${cvUrl}...`);

      await page.goto(cvUrl, {
        waitUntil: 'networkidle0',
        timeout: CONFIG.timeout,
      });

      // Generar PDF con formato A4
      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: false,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });

      console.log(`✅ CV generado: ${outputPath}`);

      // Copiar a public/ para que Cloudflare los incluya sin Puppeteer
      const publicPath = path.join(CONFIG.publicDir, `cv-${lang}.pdf`);
      fs.copyFileSync(outputPath, publicPath);
      console.log(`📋 Copiado a: ${publicPath}`);
    }

    console.log(`\n🎉 Todos los CVs generados y copiados a public/`);
  } catch (error) {
    console.error('❌ Error generando PDF:', error);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

// Ejecutar
generatePDFs();

