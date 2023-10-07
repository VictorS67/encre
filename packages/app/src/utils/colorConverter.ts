export const hexToRgba = (hex: string, alpha = 1) => {
  const [r, g, b] = [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
