/** copy-email.ts - Funcionalidad de copiar email al portapapeles con toast */

import { onReady } from '../utils/init';
import { canTouch } from '../utils/dom';

const EMAIL = 'alvaro@lostal.dev';

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

  toast = document.createElement('div');
  toast.id = 'email-toast';
  toast.className = 'email-toast';
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <span class="toast-text">
      <i class="fas fa-check"></i>
      Copiado
    </span>
    <a href="mailto:${EMAIL}" class="toast-action" title="Abrir cliente de correo">
      Enviar
      <i class="fas fa-arrow-right"></i>
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

  buttons.forEach(btn => {
    // Evitar duplicar listeners
    if (btn.dataset.copyInitialized) return;
    btn.dataset.copyInitialized = 'true';

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
