export const isColorDark = (hex: string): boolean => {
    const rgb = parseInt(hex.slice(1), 16); // Convert hex to an integer
    const r = (rgb >> 16) & 0xff; // Extract red
    const g = (rgb >> 8) & 0xff; // Extract green
    const b = rgb & 0xff; // Extract blue
    const brightness = (r * 299 + g * 587 + b * 114) / 1000; // Calculate brightness
    return brightness < 128; // Return true if brightness is less than 128
  };