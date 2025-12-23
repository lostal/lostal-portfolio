/**
 * magnetic.ts
 *
 * Magnetic Button Effect
 * Creates an attraction effect where buttons move towards the cursor.
 *
 * Features:
 * - Smooth magnetic attraction
 * - Ripple effect on click
 * - Configurable strength and distance
 * - Auto-cleanup on element removal
 */

interface MagneticConfig {
  strength: number; // How much the element moves (0-1)
  threshold: number; // Distance from element to trigger effect (px)
  resetSpeed: number; // Speed to reset position (ms)
}

const defaultConfig: MagneticConfig = {
  strength: 0.3,
  threshold: 100,
  resetSpeed: 300,
};

class MagneticButton {
  private element: HTMLElement;
  private config: MagneticConfig;
  private isHovering: boolean = false;
  private animationId: number | null = null;
  private targetX: number = 0;
  private targetY: number = 0;
  private currentX: number = 0;
  private currentY: number = 0;

  constructor(element: HTMLElement, config: Partial<MagneticConfig> = {}) {
    this.element = element;
    this.config = { ...defaultConfig, ...config };

    this.init();
  }

  private init(): void {
    // Set up for magnetic effect
    this.element.style.willChange = 'transform';

    // Bind events
    this.element.addEventListener('mouseenter', this.handleMouseEnter);
    this.element.addEventListener('mousemove', this.handleMouseMove);
    this.element.addEventListener('mouseleave', this.handleMouseLeave);
    this.element.addEventListener('click', this.handleClick);
  }

  private handleMouseEnter = (): void => {
    this.isHovering = true;
    this.element.style.transition = 'none';
    this.startAnimation();
  };

  private handleMouseMove = (e: MouseEvent): void => {
    if (!this.isHovering) return;

    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Apply strength factor
    this.targetX = distanceX * this.config.strength;
    this.targetY = distanceY * this.config.strength;
  };

  private handleMouseLeave = (): void => {
    this.isHovering = false;
    this.targetX = 0;
    this.targetY = 0;

    // Smooth spring-back animation
    this.element.style.transition = `transform ${this.config.resetSpeed}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
    this.element.style.transform = 'translate(0, 0)';
  };

  private handleClick = (e: MouseEvent): void => {
    // Create ripple effect
    this.createRipple(e);
  };

  private createRipple(e: MouseEvent): void {
    const rect = this.element.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    this.element.style.setProperty('--ripple-x', `${x}%`);
    this.element.style.setProperty('--ripple-y', `${y}%`);

    this.element.classList.add('ripple-active');

    // Remove ripple class after animation
    setTimeout(() => {
      this.element.classList.remove('ripple-active');
    }, 600);
  }

  private startAnimation(): void {
    if (this.animationId !== null) return;
    this.animate();
  }

  private animate = (): void => {
    const lerpFactor = 0.15;

    // Lerp towards target position
    this.currentX += (this.targetX - this.currentX) * lerpFactor;
    this.currentY += (this.targetY - this.currentY) * lerpFactor;

    if (this.isHovering) {
      this.element.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;
    }

    // Continue animation if still hovering
    const isStillMoving =
      Math.abs(this.currentX - this.targetX) > 0.1 ||
      Math.abs(this.currentY - this.targetY) > 0.1;

    if (this.isHovering || isStillMoving) {
      this.animationId = requestAnimationFrame(this.animate);
    } else {
      this.animationId = null;
    }
  };

  public destroy(): void {
    this.element.removeEventListener('mouseenter', this.handleMouseEnter);
    this.element.removeEventListener('mousemove', this.handleMouseMove);
    this.element.removeEventListener('mouseleave', this.handleMouseLeave);
    this.element.removeEventListener('click', this.handleClick);

    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

/**
 * Initialize magnetic effect on all elements with .magnetic-btn class
 */
function initMagneticButtons(): void {
  // Only enable on devices with precise pointer
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }

  const buttons = document.querySelectorAll<HTMLElement>(
    '.magnetic-btn, .btn-primary, .btn'
  );

  buttons.forEach(element => {
    const config: Partial<MagneticConfig> = {};

    if (element.dataset.magneticStrength) {
      config.strength = parseFloat(element.dataset.magneticStrength);
    }
    if (element.dataset.magneticThreshold) {
      config.threshold = parseFloat(element.dataset.magneticThreshold);
    }

    new MagneticButton(element, config);
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initMagneticButtons);

// Re-initialize on page navigation
document.addEventListener('astro:page-load', initMagneticButtons);

export { MagneticButton, initMagneticButtons };
