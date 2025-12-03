import fs from 'fs';
import path from 'path';
import { build } from 'esbuild';
// Use chokidar for robust watching if available
let chokidar = null;
try {
  // dynamic require-like import for ESM minimal compatibility
  chokidar = await import('chokidar').then(m => m.default || m);
} catch {
  // not installed; watch will fall back to fs.watch
}

const SRC_DIR = path.resolve('./src/scripts');
const OUT_DIR = path.resolve('./public/scripts');

async function buildAll() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error('No existe', SRC_DIR);
    process.exit(1);
  }
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
  if (files.length === 0) {
    console.log('No hay archivos .ts/.js en', SRC_DIR);
    return;
  }

  for (const file of files) {
    const entry = path.join(SRC_DIR, file);
    // Ensure output is always .js
    const outFileDisplay = file.replace(/\.ts$/, '.js');
    const outfile = path.join(OUT_DIR, outFileDisplay);
    try {
      await build({
        entryPoints: [entry],
        outfile,
        bundle: false,
        minify: true,
        format: 'iife',
        target: ['es2017'],
        sourcemap: false,
        define: { 'process.env.NODE_ENV': '"production"' },
        legalComments: 'none',
        charset: 'utf8',
      });
      console.log('Built', outfile);
    } catch (err) {
      console.error('Build error for', entry, err);
    }
  }
}

// CLI
const args = process.argv.slice(2);
const watch = args.includes('--watch');

(async () => {
  if (watch) {
    console.log('Starting scripts watcher for', SRC_DIR);
    // initial build
    await buildAll();
    // use chokidar if installed (more reliable across platforms)
    if (chokidar) {
      const watcher = chokidar.watch(SRC_DIR, {
        ignoreInitial: true,
        awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 50 },
      });
      let timer = null;
      const onChange = (evt, filename) => {
        if (!filename) return;
        if (!filename.endsWith('.ts') && !filename.endsWith('.js')) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          console.log(
            'Change detected in',
            filename,
            '- rebuilding scripts...'
          );
          buildAll().catch(err => console.error('Rebuild failed:', err));
        }, 150);
      };
      watcher.on('add', p => onChange('add', p));
      watcher.on('change', p => onChange('change', p));
      watcher.on('unlink', p => onChange('unlink', p));
      console.log('Watcher running (chokidar) — press Ctrl+C to stop.');
      // keep process alive
      process.stdin.resume();
    } else {
      // fallback to fs.watch
      let timer = null;
      fs.watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
        if (!filename) return;
        if (!filename.endsWith('.ts') && !filename.endsWith('.js')) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          console.log(
            'Change detected in',
            filename,
            '- rebuilding scripts...'
          );
          buildAll().catch(err => console.error('Rebuild failed:', err));
        }, 150);
      });
      console.log('Watcher running (fs.watch) — press Ctrl+C to stop.');
      process.stdin.resume();
    }
  } else {
    await buildAll();
  }
})().catch(err => {
  console.error(err);
  process.exit(1);
});
