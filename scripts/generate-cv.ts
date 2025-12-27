/**
 * Script de generación automática de CV en PDF (multi-idioma)
 * Ejecutado automáticamente después de cada build de producción
 * Genera cv-es.pdf y cv-en.pdf con metadatos vía exiftool
 *
 * Uso: npx tsx scripts/generate-cv.ts
 *
 * Requisitos:
 * - exiftool instalado y disponible en PATH
 *   Windows: choco install exiftool / scoop install exiftool
 *   macOS: brew install exiftool
 *   Linux: apt install libimage-exiftool-perl
 */

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import handler from 'serve-handler';
import puppeteer from 'puppeteer';

const execAsync = promisify(exec);

// Idiomas soportados y nombres de archivo
const LANGUAGES = ['es', 'en'] as const;
type Language = (typeof LANGUAGES)[number];

const FILE_NAMES: Record<Language, string> = {
  es: 'AlvaroLostal_CV.pdf',
  en: 'AlvaroLostal_Resume.pdf',
};

// Metadatos del PDF por idioma (PDF/UA compliant)
const PDF_METADATA: Record<
  Language,
  { title: string; subject: string; language: string; keywords: string }
> = {
  es: {
    title: 'CV - Álvaro Lostal',
    subject: 'Curriculum Vitae - Desarrollador Web',
    language: 'es-ES',
    keywords: 'Desarrollador Web, CV, Curriculum Vitae, Álvaro Lostal',
  },
  en: {
    title: 'Resume - Álvaro Lostal',
    subject: 'Resume - Web Developer',
    language: 'en-US',
    keywords: 'Web Developer, Resume, CV, Álvaro Lostal',
  },
};

// Configuración
const CONFIG = {
  buildDir: path.join(process.cwd(), 'dist'),
  cvRouteBase: '/cv-print',
  port: 8080,
  timeout: 60000,
  author: 'Álvaro Lostal',
  creator: 'lostal.dev',
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
 * Verifica que exiftool esté disponible en el sistema
 */
async function checkExiftool(): Promise<boolean> {
  try {
    await execAsync('exiftool -ver');
    return true;
  } catch {
    return false;
  }
}

/**
 * Añade metadatos al PDF usando exiftool (preserva tags de accesibilidad)
 */
async function addPdfMetadata(pdfPath: string, lang: Language): Promise<void> {
  const metadata = PDF_METADATA[lang];
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];

  // Construir comando exiftool con metadatos (PDF/UA enhanced)
  // -overwrite_original evita crear archivos _original de backup
  const args = [
    `exiftool`,
    `-overwrite_original`,
    `-Title="${metadata.title}"`,
    `-Author="${CONFIG.author}"`,
    `-Subject="${metadata.subject}"`,
    `-Description="${metadata.subject}"`,
    `-Keywords="${metadata.keywords}"`,
    `-Creator="${CONFIG.creator}"`,
    `-Producer="Puppeteer (Chrome)"`,
    `-CreateDate="${now}"`,
    `-ModifyDate="${now}"`,
    `-Language="${metadata.language}"`,
    `"${pdfPath}"`,
  ].join(' ');

  await execAsync(args);
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

  // Verificar que exiftool está disponible (opcional para desarrollo local)
  const hasExiftool = await checkExiftool();
  if (!hasExiftool) {
    console.warn(
      '⚠️  exiftool no encontrado - los PDFs se generarán sin metadatos personalizados'
    );
    console.warn(
      '   En CI (GitHub Actions) exiftool se instala automáticamente'
    );
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
      // Color mejorado para contraste WCAG AA: #6b7280 (ratio ~4.8:1)
      const footerTemplate = `
        <div style="width: 100%; font-size: 11px; font-family: 'Inter', system-ui, sans-serif; color: #6b7280; padding: 0 14mm; display: flex; justify-content: space-between;">
          <span>${footerText}</span>
          <span><span class="pageNumber"></span></span>
        </div>
      `;

      // Generar PDF con formato A4, tagged para accesibilidad (PDF/UA)
      // IMPORTANTE: Los tags se preservan porque NO usamos pdf-lib para post-procesar
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        tagged: true, // PDF estructurado para screen readers (WCAG 2.1 / PDF/UA)
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate,
        margin: { top: '12mm', right: '14mm', bottom: '16mm', left: '14mm' },
      });

      // Guardar PDF primero
      fs.writeFileSync(outputPath, pdfBuffer);

      // Añadir metadatos con exiftool si está disponible
      if (hasExiftool) {
        console.log(`📝 Añadiendo metadatos con exiftool...`);
        await addPdfMetadata(outputPath, lang);
      }

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
