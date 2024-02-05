export function getColorMode(): string | null {
  // Select the element that contains the 'data-color-mode' attribute
  const element = document.querySelector('[data-color-mode]');

  // Check if the element exists and return the attribute value
  return element ? element.getAttribute('data-color-mode') : null;
}
