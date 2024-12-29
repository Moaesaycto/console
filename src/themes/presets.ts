import { ConsoleTheme } from "../components/console/types";

export const themes: { [key: string]: ConsoleTheme } = {
    darkMode: {
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
        secondary: "#171717",
        default: "#171717",
      },
    },
    lightMode: {
      name: "lightMode",
      font: "monospace",
      fontSize: "14px",
      lineHeight: "1.5",
      textColor: {
        primary: "#2C2C2C",
        secondary: "#0066CC",
        warning: "#FFA500",
        error: "#FF0000",
        default: "#333333",
      },
      backgroundColor: {
        primary: "#FFFFFF",
        secondary: "#F0F0F0",
        default: "#FAFAFA",
      },
      scrollColor: {
        primary: "#CCCCCC",
        secondary: "#E0E0E0",
        default: "#F5F5F5",
      },
    },
    retroTerminal: {
      name: "retroTerminal",
      font: "Courier New, monospace",
      fontSize: "14px",
      lineHeight: "1.3",
      textColor: {
        primary: "#00FF00",
        secondary: "#FFFF00",
        warning: "#FF4500",
        error: "#FF0000",
        default: "#00FF00",
      },
      backgroundColor: {
        primary: "#000000",
        secondary: "#333333",
        default: "#111111",
      },
      scrollColor: {
        primary: "#00FF00",
        secondary: "#333333",
        default: "#111111",
      },
    },
    cyberpunk: {
      name: "cyberpunk",
      font: "monospace",
      fontSize: "16px",
      lineHeight: "1.4",
      textColor: {
        primary: "#FF00FF",
        secondary: "#00FFFF",
        warning: "#FFD700",
        error: "#FF4500",
        default: "#FFFFFF",
      },
      backgroundColor: {
        primary: "#120136",
        secondary: "#2D1B46",
        default: "#1B1032",
      },
      scrollColor: {
        primary: "#FF00FF",
        secondary: "#2D1B46",
        default: "#1B1032",
      },
    },
    highContrast: {
      name: "highContrast",
      font: "monospace",
      fontSize: "14px",
      lineHeight: "1.5",
      textColor: {
        primary: "#FFFFFF",
        secondary: "#00FFFF",
        warning: "#FFFF00",
        error: "#FF0000",
        default: "#FFFFFF",
      },
      backgroundColor: {
        primary: "#000000",
        secondary: "#1A1A1A",
        default: "#0A0A0A",
      },
      scrollColor: {
        primary: "#FFFFFF",
        secondary: "#333333",
        default: "#1A1A1A",
      },
    },
  };
  