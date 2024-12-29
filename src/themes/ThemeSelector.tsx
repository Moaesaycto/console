import React from "react";
import { ConsoleTheme } from "../components/console/types";

interface ThemeSelectorProps {
  currentTheme: string;
  themes: { [key: string]: ConsoleTheme };
  onThemeChange: (themeName: string) => void;
}

/**
 * Converts camelCase or snake_case strings to Title Case for better readability.
 */
const formatThemeName = (themeName: string): string => {
  return themeName
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/[_-]/g, " ") // Replace underscores or hyphens with spaces
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  themes,
  onThemeChange,
}) => {
  return (
    <div style={{ margin: "20px 0", textAlign: "right", width: "80%" }}>
      <label
        htmlFor="themeSelector"
        style={{
          color: "#FFFFFF",
          marginRight: "10px",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        Select Theme:
      </label>
      <select
        id="themeSelector"
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "6px",
          backgroundColor: "#444",
          color: "#FFFFFF",
          border: "1px solid #666",
          cursor: "pointer",
        }}
        aria-label="Theme Selector"
      >
        {Object.keys(themes).map((themeName) => (
          <option key={themeName} value={themeName}>
            {formatThemeName(themeName)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;
