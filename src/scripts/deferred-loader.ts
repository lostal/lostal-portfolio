// src/scripts/deferred-loader.js
// Source copy so build-scripts will emit a production copy to public/scripts
(function () {
  const SCRIPTS = [
    '/scripts/navigation.js',
    '/scripts/animations.js',
    '/scripts/auto-scroll.js',
    '/scripts/floating-contact.js',
    '/scripts/theme.js',
  ];

  function loadScript(src: string) {
    try {
      const s = document.createElement('script');
      s.src = src;
      s.defer = true;
      s.async = false;
      document.head.appendChild(s);
    } catch (e) {
      console.warn('Failed to inject script', src, e);
    }
  }

  function run() {
    for (const src of SCRIPTS) loadScript(src);
  }

  if (typeof window === 'undefined') return;

  if ('requestIdleCallback' in window) {
    requestIdleCallback(run, { timeout: 2000 });
  } else if (document.readyState === 'complete') {
    setTimeout(run, 0);
  } else {
    (window as Window).addEventListener('load', function onload() {
      (window as Window).removeEventListener('load', onload);
      setTimeout(run, 0);
    });
  }
})();
