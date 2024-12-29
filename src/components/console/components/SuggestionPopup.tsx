import React, { useEffect, useRef } from "react";
import {
  getSuggestionsBoxStyle,
  getSuggestionItemStyle,
} from "../style/consoleStyles";
import { ConsoleTheme } from "../utils/theme";

interface SuggestionPopupProps {
  suggestions: string[];
  suggestionIndex: number;
  setSuggestionIndex: (index: number) => void;
  onSelectSuggestion: (suggestion: string) => void;
  theme: ConsoleTheme;
}

const SuggestionPopup: React.FC<SuggestionPopupProps> = ({
  suggestions,
  suggestionIndex,
  setSuggestionIndex,
  onSelectSuggestion,
  theme,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure the active suggestion is always visible
  useEffect(() => {
    if (containerRef.current) {
      const activeSuggestion = containerRef.current.children[suggestionIndex];
      if (activeSuggestion) {
        (activeSuggestion as HTMLElement).scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [suggestionIndex]);

  return (
    <div style={getSuggestionsBoxStyle(theme)}>
      {/* Up Arrow */}
      {suggestionIndex > 0 && (
        <div
          style={{
            height: "20px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
          onClick={() => setSuggestionIndex(Math.max(suggestionIndex - 1, 0))}
        >
          ▲
        </div>
      )}

      {/* Suggestions */}
      <div
        ref={containerRef}
        style={{
          maxHeight: "150px",
          overflow: "hidden",
        }}
      >
        {suggestions.map((sug, idx) => (
          <div
            key={sug}
            style={getSuggestionItemStyle(theme, idx === suggestionIndex)}
            onMouseEnter={() => setSuggestionIndex(idx)}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelectSuggestion(sug);
            }}
          >
            {sug}
          </div>
        ))}
      </div>

      {/* Down Arrow */}
      {suggestionIndex < suggestions.length - 1 && (
        <div
          style={{
            height: "20px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
          onClick={() =>
            setSuggestionIndex(Math.min(suggestionIndex + 1, suggestions.length - 1))
          }
        >
          ▼
        </div>
      )}
    </div>
  );
};

export default SuggestionPopup;
