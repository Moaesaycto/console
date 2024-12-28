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

/**
 * Checks if a given string is a valid CSS color. Absolutely insane
 */
export function isValidColor(color: string): boolean {
  if (!color || typeof color !== "string") {
    return false;
  }

  // hex codes
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (hexColorRegex.test(color)) {
    return true;
  }

  // rgb/rgba colors: rgb(255, 255, 255) or rgba(255, 255, 255, 0.5)
  const rgbColorRegex =
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*(0|0?\.\d+|1(\.0)?))?\)$/;
  if (rgbColorRegex.test(color)) {
    // Validate RGB(A) component ranges
    const match = color.match(rgbColorRegex);
    if (match) {
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);
      const a = match[5] ? parseFloat(match[5]) : null;

      if (r <= 255 && g <= 255 && b <= 255 && (a === null || (a >= 0 && a <= 1))) {
        return true;
      }
    }
  }

  // hsl/hsla colors: hsl(360, 100%, 50%) or hsla(360, 100%, 50%, 0.5)
  const hslColorRegex =
    /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(,\s*(0|0?\.\d+|1(\.0)?))?\)$/;
  if (hslColorRegex.test(color)) {
    // Validate HSL(A) component ranges
    const match = color.match(hslColorRegex);
    if (match) {
      const h = parseInt(match[1], 10);
      const s = parseInt(match[2], 10);
      const l = parseInt(match[3], 10);
      const a = match[5] ? parseFloat(match[5]) : null;

      if (h <= 360 && s <= 100 && l <= 100 && (a === null || (a >= 0 && a <= 1))) {
        return true;
      }
    }
  }

  // named colors
  const namedColors = new Set([
    "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque",
    "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue",
    "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson",
    "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen",
    "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid",
    "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray",
    "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue",
    "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen",
    "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green",
    "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory",
    "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue",
    "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen",
    "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue",
    "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime",
    "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue",
    "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue",
    "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue",
    "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive",
    "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen",
    "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink",
    "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown",
    "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue",
    "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue",
    "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white",
    "whitesmoke", "yellow", "yellowgreen",
  ]);
  if (namedColors.has(color.toLowerCase())) {
    return true;
  }

  return false;
}

