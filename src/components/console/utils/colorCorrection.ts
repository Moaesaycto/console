/**
 * Determines if a given color is dark based on its brightness.
 *
 * This function converts a color code to its RGB components, calculates the brightness
 * using the formula: (r * 299 + g * 587 + b * 114) / 1000, and returns true if the brightness
 * is less than 128, indicating a dark color.
 *
 * @param color - The color code in the format `#RRGGBB`, `#RGB`, or a named color.
 * @returns `true` if the color is dark, otherwise `false`.
 */
export const isColorDark = (color: string): boolean => {
  let r: number, g: number, b: number;

  if (color.startsWith('#')) {
    if (color.length === 4) {
      // Shorthand hex color #RGB
      r = parseInt(color[1] + color[1], 16);
      g = parseInt(color[2] + color[2], 16);
      b = parseInt(color[3] + color[3], 16);
    } else if (color.length === 7) {
      // Full hex color #RRGGBB
      const rgb = parseInt(color.slice(1), 16);
      r = (rgb >> 16) & 0xff;
      g = (rgb >> 8) & 0xff;
      b = rgb & 0xff;
    } else {
      throw new Error('Invalid hex color format');
    }
  } else {
    // Named color
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    ctx.fillStyle = color;
    const computedColor = ctx.fillStyle;
    const rgb = parseInt(computedColor.slice(1), 16);
    r = (rgb >> 16) & 0xff;
    g = (rgb >> 8) & 0xff;
    b = rgb & 0xff;
  }

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};