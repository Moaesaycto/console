import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
  FormEvent,
} from "react";
import { Command } from "./types";
import { parseColorTokens, ColorSegment } from "./utils/colorParsing";
import { ConsoleTheme, mergeTheme } from "./utils/theme";
import { builtInCommands } from "./commands/commands";

import { updateSuggestions } from "./logic/updateSuggestions";
import { processCommand } from "./logic/processCommand";
import {
  getConsoleContainerStyle,
  getOutputAreaStyle,
  getInputContainerStyle,
  getInputStyle,
  getRunButtonStyle,
  getGhostStyle
} from "./style/consoleStyles";
import { bindAutoComplete } from "./utils/bindAutoComplete";
import { helpCommand } from "./commands/builtInCommands";
import SuggestionBox from "./components/SuggestionPopup";


interface ConsoleLineProps {
  commands: Command[];
  style?: ConsoleTheme;
  startMessage?: string;
}


export const ConsoleLine: React.FC<ConsoleLineProps> = ({ commands, style, startMessage }) => {
  commands = [...builtInCommands, ...commands];

  helpCommand.autoComplete = bindAutoComplete(commands);

  const finalTheme = mergeTheme(style);

  const [history, setHistory] = useState<string[]>(startMessage ? [startMessage] : []);
  const [input, setInput] = useState<string>("");

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    updateSuggestions(input, commands, setSuggestions, setShowSuggestions, setSuggestionIndex);
  }, [input]);


  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;
    processCommand(cmd, commands, setHistory, setCommandHistory, setHistoryIndex);
    setInput("");
    setShowSuggestions(false);
  }


  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    setHistoryIndex(-1);
  }


  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSuggestionIndex((prev) => (prev === suggestions.length - 1 ? 0 : prev + 1));
        return;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSuggestionIndex((prev) => (prev === 0 ? suggestions.length - 1 : prev - 1));
        return;
      } else if (e.key === "Escape" || e.key === "ArrowRight") {
        e.preventDefault();
        setShowSuggestions(false); // Hide suggestions on Escape or Right Arrow
        return;
      } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        autoCompleteSuggestion();
        return;
      }
    } else {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        navigateHistory("older");
        return;
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        navigateHistory("newer");
        return;
      } else if (e.key === "Enter") {
        handleSubmit(e);
        return;
      }
    }
  }
  
  


  function navigateHistory(direction: "older" | "newer") {
    let newIndex = historyIndex;
    if (direction === "older") {
      newIndex = newIndex === -1 ? commandHistory.length - 1 : newIndex - 1;
      newIndex = Math.max(newIndex, 0);
    } else {
      newIndex = newIndex + 1;
      if (newIndex >= commandHistory.length) {
        newIndex = -1;
      }
    }
    setHistoryIndex(newIndex);
    if (newIndex === -1) {
      setInput("");
    } else {
      setInput(commandHistory[newIndex]);
    }
  }


  function autoCompleteSuggestion() {
    if (!suggestions.length) return;

    const splitted = input.split(" ");
    const endsWithSpace = input.endsWith(" ");
    const selectedSuggestion = suggestions[suggestionIndex];

    if (!selectedSuggestion) {
      // Ensure a valid suggestion exists
      return;
    }

    if (endsWithSpace) {
      setInput(input + selectedSuggestion + " ");
    } else {
      if (splitted.length > 0) {
        splitted[splitted.length - 1] = selectedSuggestion;
        setInput(splitted.join(" ") + " ");
      } else {
        setInput(selectedSuggestion + " ");
      }
    }

    setShowSuggestions(false);
    setSuggestions([]);
  }



  let ghostedText = "";
  if (showSuggestions && suggestions.length > 0 && input.trim()) {
    // Match the last token of the input
    const lastSpaceIndex = input.lastIndexOf(" ");
    const lastToken = lastSpaceIndex === -1 ? input : input.slice(lastSpaceIndex + 1);
    const suggestion = suggestions[suggestionIndex];

    if (suggestion && lastToken !== undefined && suggestion.startsWith(lastToken)) {
      ghostedText = suggestion.slice(lastToken.length);
    }
  }

  function handleSuggestionSelect(suggestion: string) {
    const splitted = input.split(" ");
    const endsWithSpace = input.endsWith(" ");
    if (endsWithSpace) {
      setInput(input + suggestion + " ");
    } else {
      if (splitted.length > 0) {
        splitted[splitted.length - 1] = suggestion;
        setInput(splitted.join(" ") + " ");
      } else {
        setInput(suggestion + " ");
      }
    }
    setShowSuggestions(false);
    setSuggestions([]);
  }


  function parseLine(line: string): ColorSegment[] {
    return parseColorTokens(line, finalTheme.textColor!);
  }

  const outputAreaClass = "console-scroll-area";

  return (
    <div style={getConsoleContainerStyle(finalTheme)}>
      <style>{`
        .${outputAreaClass} {
          scrollbar-width: thin;
          scrollbar-color: ${finalTheme.scrollColor?.primary} ${finalTheme.scrollColor?.default};
        }
        .${outputAreaClass}::-webkit-scrollbar {
          width: 8px;
        }
        .${outputAreaClass}::-webkit-scrollbar-track {
          background: ${finalTheme.scrollColor?.default};
        }
        .${outputAreaClass}::-webkit-scrollbar-thumb {
          background-color: ${finalTheme.scrollColor?.primary};
        }
        .${outputAreaClass}::-webkit-scrollbar-thumb:hover {
          background-color: ${finalTheme.scrollColor?.secondary};
        }
      `}</style>

      <div ref={scrollRef} className={outputAreaClass} style={getOutputAreaStyle(finalTheme)}>
        {history.map((line, idx) => {
          const segments = parseLine(line);
          return (
            <div key={idx} style={{ display: "inline-block", width: "100%" }}>
              {segments.map((seg, segIdx) => (
                <span key={segIdx} style={{ color: seg.color }}>
                  {seg.text}
                </span>
              ))}
              <br />
            </div>
          );
        })}
      </div>

      <div style={getInputContainerStyle(finalTheme)}>
        <form
          style={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          onSubmit={handleSubmit}
        >
          <div style={{ position: "relative", width: "100%" }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              style={getInputStyle(finalTheme)}
              placeholder="Type a command..."
              autoComplete="off"
              spellCheck="false"
            />
            {ghostedText && (
              <span style={{ ...getGhostStyle(finalTheme), whiteSpace: "pre-wrap" }}>
                {input}
                <span style={{ opacity: 0.5 }}>{ghostedText}</span>
              </span>
            )}
          </div>

          <button type="submit" style={getRunButtonStyle(finalTheme)}>
            Run
          </button>
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <SuggestionBox
          suggestions={suggestions}
          suggestionIndex={suggestionIndex}
          setSuggestionIndex={setSuggestionIndex}
          onSuggestionSelect={handleSuggestionSelect}
          theme={finalTheme}
          maxVisibleSuggestions={3} // Set your desired number here
        />
        
        )}
      </div>
    </div>
  );
};

export default ConsoleLine;
