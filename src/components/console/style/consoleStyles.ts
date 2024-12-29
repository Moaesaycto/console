import { CSSProperties } from "react";
import { ConsoleTheme } from "../types";
import { isColorDark } from "../utils/colorCorrection";

export const getConsoleContainerStyle = (finalTheme: ConsoleTheme): CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  fontFamily: finalTheme.font,
  fontSize: finalTheme.fontSize,
  lineHeight: finalTheme.lineHeight,
  position: "relative",
});

export const getOutputAreaStyle = (finalTheme: ConsoleTheme): CSSProperties => ({
  flexGrow: 1,
  backgroundColor: finalTheme.backgroundColor?.primary,
  color: finalTheme.textColor?.primary,
  padding: "8px",
  whiteSpace: "pre-wrap",
  overflowY: "auto",
});

export const getInputContainerStyle = (finalTheme: ConsoleTheme): CSSProperties => ({
  backgroundColor: finalTheme.backgroundColor?.secondary,
  padding: "4px",
  display: "flex",
  alignItems: "center",
  position: "relative",
});

export const getInputStyle = (finalTheme: ConsoleTheme): CSSProperties => ({
  width: "100%",
  padding: "6px",
  border: "none",
  outline: "none",
  background: "transparent",
  color: finalTheme.textColor?.primary,
  fontFamily: finalTheme.font,
  fontSize: finalTheme.fontSize,
  lineHeight: finalTheme.lineHeight,
});

export const getRunButtonStyle = (finalTheme: ConsoleTheme): CSSProperties => {
  const backgroundColor = finalTheme.textColor?.primary || "#349E44";
  const textColor = isColorDark(backgroundColor) ? "#FFFFFF" : "#000000";

  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 12px",
    border: "none",
    backgroundColor,
    color: textColor,
    marginLeft: "8px",
    cursor: "pointer",
    borderRadius: "4px",
    fontFamily: finalTheme.font,
    fontSize: finalTheme.fontSize,
    lineHeight: finalTheme.lineHeight,
    fontWeight: "bold",
  };
};


export const getSuggestionsBoxStyle = (finalTheme: ConsoleTheme): CSSProperties => ({
  position: "absolute",
  bottom: "45px",
  left: "8px",
  backgroundColor: finalTheme.backgroundColor?.secondary || "#222",
  borderRadius: "4px",
  padding: "4px",
  zIndex: 999,
  maxHeight: "120px",
  overflowY: "auto",
  minWidth: "150px",
  fontFamily: finalTheme.font,
  fontSize: finalTheme.fontSize,
  lineHeight: finalTheme.lineHeight,
  color: finalTheme.textColor?.primary,
});

export const getSuggestionItemStyle = (finalTheme: ConsoleTheme, active: boolean): CSSProperties => ({
  padding: "4px 8px",
  backgroundColor: active
    ? finalTheme.backgroundColor?.primary || "#555"
    : "transparent",
  color: active
    ? finalTheme.textColor?.secondary || "#FFF"
    : finalTheme.textColor?.primary || "#FFF",
  cursor: "pointer",
  fontFamily: finalTheme.font,
  fontSize: finalTheme.fontSize,
  lineHeight: finalTheme.lineHeight,
  borderRadius: "2px",
  transition: "background-color 0.2s ease, color 0.2s ease",
});

export const getGhostStyle = (finalTheme: ConsoleTheme): CSSProperties => ({
  position: "absolute",
  left: 0,
  top: 0,
  pointerEvents: "none",
  userSelect: "none",
  color: "rgba(255,255,255,0.3)",
  fontFamily: finalTheme.font,
  fontSize: finalTheme.fontSize,
  lineHeight: finalTheme.lineHeight,
  padding: "6px",
});
