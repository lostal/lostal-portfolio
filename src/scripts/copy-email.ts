/** copy-email.ts - Funcionalidad de copiar email al portapapeles con toast */

import { onReady } from '../utils/init';
import { canTouch } from '../utils/dom';

const EMAIL = 'alvaro@lostal.dev';

// Traducciones inline para el toast (evita dependencia de i18n en runtime)
const TOAST_I18N = {
  es: {
    success: 'Copiado',
    send: 'Enviar',
    sendTitle: 'Abrir cliente de correo',
  },
  en: { success: 'Copied', send: 'Send', sendTitle: 'Open email client' },
} as const;

/** Detecta el idioma actual de la página */
function getCurrentLang(): 'es' | 'en' {
  return window.location.pathname.startsWith('/en') ? 'en' : 'es';
}

let toast: HTMLElement | null = null;
let isToastVisible = false;
let rafId: number | null = null;

/** Calcula la posición bottom del toast para no solaparse con el widget */
function getToastBottom(): number {
  // En móvil o táctil, posición fija
  if (canTouch() || window.matchMedia('(max-width: 768px)').matches) {
    return 24;
  }

  const widget = document.getElementById('floating-contact');
  if (!widget) return 24;

  // Si el widget está docked o no visible, posición normal
  if (
    widget.classList.contains('docked') ||
    !widget.classList.contains('visible')
  ) {
    return 24;
  }

  // Si el widget está flotando (visible), calcular distancia de seguridad
  const widgetRect = widget.getBoundingClientRect();
  const widgetTop = widgetRect.top;
  const windowHeight = window.innerHeight;
  const safetyMargin = 16;

  // Calcular cuánto espacio hay desde abajo de la ventana hasta el widget
  const spaceFromBottom = windowHeight - widgetTop;

  return Math.max(spaceFromBottom + safetyMargin, 24);
}

/** Actualiza la posición del toast continuamente mientras es visible */
function updateToastPosition() {
  if (!toast || !isToastVisible) {
    rafId = null;
    return;
  }

  const bottomPos = getToastBottom();
  toast.style.bottom = `${bottomPos}px`;

  rafId = requestAnimationFrame(updateToastPosition);
}

/** Inicia el loop de actualización de posición */
function startPositionUpdate() {
  if (rafId !== null) return;
  updateToastPosition();
}

/** Detiene el loop de actualización de posición */
function stopPositionUpdate() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

/** Crea el toast en el body si no existe */
function createToast(): HTMLElement {
  if (toast) return toast;

  const lang = getCurrentLang();
  const t = TOAST_I18N[lang];

  toast = document.createElement('div');
  toast.id = 'email-toast';
  toast.className = 'email-toast';
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <span class="toast-text">
      <i class="fas fa-check" aria-hidden="true"></i>
      ${t.success}
    </span>
    <a href="mailto:${EMAIL}" class="toast-action" title="${t.sendTitle}">
      ${t.send}
      <i class="fas fa-arrow-right" aria-hidden="true"></i>
    </a>
  `;
  document.body.appendChild(toast);

  // Ocultar toast al hacer clic en enviar
  toast.querySelector('.toast-action')?.addEventListener('click', () => {
    hideToast();
  });

  return toast;
}

/** Muestra el toast e inicia la actualización de posición */
function showToast() {
  if (!toast) return;
  isToastVisible = true;
  toast.classList.add('visible');
  startPositionUpdate();
}

/** Oculta el toast y detiene la actualización de posición */
function hideToast() {
  if (!toast) return;
  isToastVisible = false;
  toast.classList.remove('visible');
  stopPositionUpdate();
}

/** Copia texto al portapapeles */
async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

/** Inicializa los event listeners para todos los botones de copiar email */
function initEmailCopy() {
  const buttons =
    document.querySelectorAll<HTMLButtonElement>('.copy-email-btn');
  createToast();
  let hideTimeout: ReturnType<typeof setTimeout>;

  // Título traducido para el botón
  const lang = getCurrentLang();
  const copyTitle = lang === 'es' ? 'Copiar email' : 'Copy email';

  buttons.forEach(btn => {
    // Evitar duplicar listeners
    if (btn.dataset.copyInitialized) return;
    btn.dataset.copyInitialized = 'true';

    // Añadir title traducido
    btn.title = copyTitle;

    btn.addEventListener('click', async () => {
      const email = btn.dataset.email;
      if (!email) return;

      await copyToClipboard(email);

      // Mostrar toast
      clearTimeout(hideTimeout);
      showToast();

      // Ocultar después de 4 segundos
      hideTimeout = setTimeout(() => {
        hideToast();
      }, 4000);
    });
  });
}

// Inicializar
onReady(initEmailCopy);
document.addEventListener('astro:after-swap', initEmailCopy);
