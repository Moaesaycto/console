/**
 * Truncates the input text to fit within the specified width.
 * 
 * @param text - The text to truncate.
 * @param inputWidth - The width of the input element in pixels.
 * @param charWidth - The approximate width of a character in pixels (default is 8).
 * @returns The truncated text, ending with "..." if truncated.
 */
export const truncateTextToFit = (text: string, inputWidth: number, charWidth: number = 8): string => {
    const maxChars = Math.floor(inputWidth / charWidth);
    return text.length > maxChars ? text.slice(0, maxChars - 3) + "..." : text;
  };
  