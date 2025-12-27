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

// Idiomas soportados y nombres de archivo
const LANGUAGES = ['es', 'en'] as const;
const FILE_NAMES: Record<(typeof LANGUAGES)[number], string> = {
  es: 'AlvaroLostal_CV.pdf',
  en: 'AlvaroLostal_Resume.pdf',
};

// Configuración
const CONFIG = {
  buildDir: path.join(process.cwd(), 'dist'),
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
      const outputPath = path.join(CONFIG.buildDir, FILE_NAMES[lang]);

      console.log(`📄 Generando CV (${lang}): ${cvUrl}...`);

      await page.goto(cvUrl, {
        waitUntil: 'networkidle0',
        timeout: CONFIG.timeout,
      });

      // Footer text según idioma
      const footerText =
        lang === 'es'
          ? 'Generado automáticamente desde lostal.dev'
          : 'Auto-generated from lostal.dev';

      // Template del footer con estilos inline (requerido por Puppeteer)
      const footerTemplate = `
        <div style="width: 100%; font-size: 11px; font-family: 'Inter', system-ui, sans-serif; color: #9ca3af; padding: 0 14mm; display: flex; justify-content: space-between;">
          <span>${footerText}</span>
          <span><span class="pageNumber"></span></span>
        </div>
      `;

      // Generar PDF con formato A4 y footer en cada página
      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate,
        margin: { top: '12mm', right: '14mm', bottom: '16mm', left: '14mm' },
      });

      console.log(`✅ CV generado: ${outputPath}`);
    }

    console.log(`\n🎉 Todos los CVs generados correctamente`);
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
