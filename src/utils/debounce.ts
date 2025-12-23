/**
 * Retrasa la ejecución de una función hasta que pase un tiempo
 * sin nuevas invocaciones. Útil para eventos frecuentes como resize.
 *
 * @param fn - Función a ejecutar con debounce
 * @param ms - Milisegundos de espera
 * @returns Función debounced
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), ms);
  };
}
