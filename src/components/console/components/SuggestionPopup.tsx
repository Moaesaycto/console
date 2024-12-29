import React, { useRef } from "react";
import { getSuggestionsBoxStyle, getSuggestionItemStyle } from "../style/consoleStyles";
import { ConsoleTheme } from "../types";
import { CSSProperties } from "react";

interface SuggestionBoxProps {
  suggestions: string[];
  suggestionIndex: number;
  setSuggestionIndex: (index: number | ((prevIndex: number) => number)) => void;
  onSuggestionSelect: (suggestion: string) => void;
  theme: ConsoleTheme;
  maxVisibleSuggestions?: number;
}

const arrowStyle: CSSProperties = {
  textAlign: "center",
  cursor: "pointer",
  padding: "0px 0",
  fontSize: "12px",
  userSelect: "none",
  lineHeight: "1",
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
  const scrollIntervalRef = useRef<number | null>(null); // For controlling the scroll interval

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

  // Start scrolling in a given direction
  const startScroll = (direction: "up" | "down") => {
    if (scrollIntervalRef.current !== null) return; // Prevent multiple intervals
    scrollIntervalRef.current = window.setInterval(() => {
      if (direction === "up") {
        handleUp();
      } else {
        handleDown();
      }
    }, 100); // Scroll every 100ms
  };

  // Stop scrolling
  const stopScroll = () => {
    if (scrollIntervalRef.current !== null) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  return (
    <div style={{ position: "relative", ...getSuggestionsBoxStyle(theme) }}>
      {/* Arrow Up */}
      {visibleStart > 0 && (
        <div
          style={{
            ...arrowStyle,
            color: theme.textColor?.primary || theme.textColor?.default || "white",
          }}
          onMouseEnter={() => startScroll("up")} // Keep the scrolling hover
          onMouseLeave={stopScroll}
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
            onMouseDown={(e) => {
              e.preventDefault();
              onSuggestionSelect(sug); // Select suggestion and reset state
            }}
          >
            <span style={{ color: theme.textColor?.primary || theme.textColor?.default || "white" }}>
              {sug}
            </span>
          </div>
        );
      })}

      {/* Arrow Down */}
      {visibleEnd < totalSuggestions && (
        <div
          style={{
            ...arrowStyle,
            color: theme.textColor?.primary || theme.textColor?.default || "white",
          }}
          onMouseEnter={() => startScroll("down")} // Keep the scrolling hover
          onMouseLeave={stopScroll}
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
