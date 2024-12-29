import React from "react";
import {
  getSuggestionsBoxStyle,
  getSuggestionItemStyle,
} from "../style/consoleStyles";

interface SuggestionBoxProps {
  suggestions: string[];
  suggestionIndex: number;
  setSuggestionIndex: (index: number) => void;
  onSuggestionSelect: (suggestion: string) => void;
  theme: any; // Replace `any` with your theme type
}

const SuggestionBox: React.FC<SuggestionBoxProps> = ({
  suggestions,
  suggestionIndex,
  setSuggestionIndex,
  onSuggestionSelect,
  theme,
}) => {
  return (
    <div style={getSuggestionsBoxStyle(theme)}>
      {suggestions.map((sug, idx) => (
        <div
          key={sug}
          style={getSuggestionItemStyle(theme, idx === suggestionIndex)}
          onMouseEnter={() => setSuggestionIndex(idx)}
          onMouseDown={(e) => {
            e.preventDefault();
            onSuggestionSelect(sug);
          }}
        >
          {sug}
        </div>
      ))}
    </div>
  );
};

export default SuggestionBox;
