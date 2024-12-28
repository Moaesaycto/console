export interface ThemeColorSet {
    primary?: string;
    secondary?: string;
    warning?: string;
    error?: string;
    default?: string; // fallback
  }
  
  export interface ScrollColorSet {
    primary?: string;
    secondary?: string;
    default?: string;
  }
  
  export interface BackgroundColorSet {
    primary?: string;
    secondary?: string;
    default?: string;
  }
  
  export interface ConsoleTheme {
    name?: string;
    font?: string;
    fontSize?: string;
    lineHeight?: string;
    textColor?: ThemeColorSet;
    backgroundColor?: BackgroundColorSet;
    scrollColor?: ScrollColorSet;
  }
  
  const defaultTheme: ConsoleTheme = {
    name: "darkMode",
    font: "monospace",
    fontSize: "14px",
    lineHeight: "1.3",
    textColor: {
      primary: "#349E44",
      secondary: "#5D60CB",
      warning: "#E2C541",
      error: "#E0002D",
      default: "#64A8BC",
    },
    backgroundColor: {
      primary: "#171717",
      secondary: "#2F2F2F",
      default: "#212121",
    },
    scrollColor: {
      primary: "#73AD34",
      secondary: "#01A816",
      default: "#115BCA",
    },
  };
  
  export function mergeTheme(partial?: ConsoleTheme): ConsoleTheme {
    if (!partial) return { ...defaultTheme };
  
    return {
      name: partial.name ?? defaultTheme.name,
      font: partial.font ?? defaultTheme.font,
      fontSize: partial.fontSize ?? defaultTheme.fontSize,
      lineHeight: partial.lineHeight ?? defaultTheme.lineHeight,
  
      textColor: {
        primary: partial.textColor?.primary ?? defaultTheme.textColor?.primary,
        secondary:
          partial.textColor?.secondary ?? defaultTheme.textColor?.secondary,
        warning: partial.textColor?.warning ?? defaultTheme.textColor?.warning,
        error: partial.textColor?.error ?? defaultTheme.textColor?.error,
        default: partial.textColor?.default ?? defaultTheme.textColor?.default,
      },
  
      backgroundColor: {
        primary:
          partial.backgroundColor?.primary ?? defaultTheme.backgroundColor?.primary,
        secondary:
          partial.backgroundColor?.secondary ??
          defaultTheme.backgroundColor?.secondary,
        default:
          partial.backgroundColor?.default ?? defaultTheme.backgroundColor?.default,
      },
  
      scrollColor: {
        primary:
          partial.scrollColor?.primary ?? defaultTheme.scrollColor?.primary,
        secondary:
          partial.scrollColor?.secondary ?? defaultTheme.scrollColor?.secondary,
        default: partial.scrollColor?.default ?? defaultTheme.scrollColor?.default,
      },
    };
  }
  