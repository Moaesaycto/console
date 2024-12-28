// /src/utils/colorParsing.ts

import { ThemeColorSet } from "./theme";

export interface ColorSegment {
  text: string;
  color: string;
}

const tokenToColorKey: Record<string, keyof ThemeColorSet> = {
  "&r": "primary",
  "&s": "secondary",
  "&w": "warning",
  "&e": "error",
};

export function parseColorTokens(
  line: string,
  themeColors: ThemeColorSet
): ColorSegment[] {
  let currentColor = themeColors.primary ?? themeColors.default ?? "#fff";
  const segments: ColorSegment[] = [];
  let buffer = "";
  let i = 0;

  while (i < line.length) {
    if (
      i < line.length - 1 &&
      line[i] === "&" &&
      ["r", "s", "w", "e"].includes(line[i + 1])
    ) {
      if (buffer) {
        segments.push({
          text: buffer,
          color: validateColor(currentColor, themeColors),
        });
        buffer = "";
      }
      const token = "&" + line[i + 1];
      const colorKey = tokenToColorKey[token];
      if (colorKey) {
        currentColor = themeColors[colorKey] ?? themeColors.default ?? "#fff";
      }
      i += 2;
    } else {
      buffer += line[i];
      i++;
    }
  }

  if (buffer) {
    segments.push({
      text: buffer,
      color: validateColor(currentColor, themeColors),
    });
  }

  return segments;
}

function validateColor(color: string, themeColors: ThemeColorSet): string {
  if (!color || !isValidColor(color)) {
    return themeColors.default ?? "#fff";
  }
  return color;
}

function isValidColor(color: string): boolean {
  // Minimal check
  if (color.startsWith("#") || color.startsWith("rgb")) {
    return true;
  }
  return true;
}
