import React from "react";
import {
  getSuggestionsBoxStyle,
  getSuggestionItemStyle,
} from "../style/consoleStyles";

interface SuggestionBoxProps {
  suggestions: string[];
  suggestionIndex: number;
  setSuggestionIndex: (index: number | ((prevIndex: number) => number)) => void;
  onSuggestionSelect: (suggestion: string) => void;
  theme: any; // Replace `any` with your theme type
  maxVisibleSuggestions?: number; // Configurable max visible suggestions
}

import { CSSProperties } from "react";

const arrowStyle: CSSProperties = {
  textAlign: "center",
  cursor: "pointer",
  padding: "2px 0", // Reduce padding for smaller height
  fontSize: "12px", // Smaller font size for arrows
  userSelect: "none",
  lineHeight: "1", // Keep the content vertically aligned
};

const SuggestionBox: React.FC<SuggestionBoxProps> = ({
  suggestions,
  suggestionIndex,
  setSuggestionIndex,
  onSuggestionSelect,
  theme,
  maxVisibleSuggestions = 3, // Default to 3 if not provided
}) => {
  const totalSuggestions = suggestions.length;

  // Determine the range of visible suggestions
  const visibleStart = Math.max(
    0,
    Math.min(
      suggestionIndex - Math.floor(maxVisibleSuggestions / 2),
      totalSuggestions - maxVisibleSuggestions
    )
  );
  const visibleEnd = Math.min(totalSuggestions, visibleStart + maxVisibleSuggestions);
  const visibleSuggestions = suggestions.slice(visibleStart, visibleEnd);

  // Handle cycling
  const handleUp = () => {
    setSuggestionIndex((prev) => (prev === 0 ? totalSuggestions - 1 : prev - 1));
  };

  const handleDown = () => {
    setSuggestionIndex((prev) => (prev === totalSuggestions - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ position: "relative", ...getSuggestionsBoxStyle(theme) }}>
      {/* Arrow Up */}
      {visibleStart > 0 && (
        <div
          style={{
            ...arrowStyle,
            color: theme.textColor?.primary || "black", // Use theme color
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleUp();
          }}
        >
          ▲
        </div>
      )}

      {/* Suggestions */}
      {visibleSuggestions.map((sug, idx) => {
        const absoluteIndex = visibleStart + idx;
        return (
          <div
            key={sug}
            style={getSuggestionItemStyle(theme, absoluteIndex === suggestionIndex)}
            onMouseEnter={() => setSuggestionIndex(absoluteIndex)}
            onMouseDown={(e) => {
              e.preventDefault();
              onSuggestionSelect(sug);
            }}
          >
            {sug}
          </div>
        );
      })}

      {/* Arrow Down */}
      {visibleEnd < totalSuggestions && (
        <div
          style={{
            ...arrowStyle,
            color: theme.textColor?.primary || "black", // Use theme color
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleDown();
          }}
        >
          ▼
        </div>
      )}
    </div>
  );
};

export default SuggestionBox;
