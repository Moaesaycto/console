import React, {
    useState,
    useRef,
    useEffect,
    KeyboardEvent,
    ChangeEvent,
    FormEvent,
    CSSProperties,
  } from "react";
  import { Command, CommandContext } from "./types";
  import { parseColorTokens, ColorSegment } from "./utils/colorParsing";
  import { ConsoleTheme, mergeTheme } from "./utils/theme";
  import { builtInCommands } from "./commands/commands";
  
  interface ConsoleLineProps {
    commands: Command[];
    style?: ConsoleTheme;
  }
  
  export const ConsoleLine: React.FC<ConsoleLineProps> = ({ commands, style }) => {
    commands = [...builtInCommands, ...commands];

    const finalTheme = mergeTheme(style);
  
    const [history, setHistory] = useState<string[]>([]);
    const [input, setInput] = useState<string>("");
  
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);
  
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [suggestionIndex, setSuggestionIndex] = useState(0);
  
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
  
    /** Effects */
    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [history]);
  
    useEffect(() => {
      updateSuggestions(input);
    }, [input]);
  
    /** Command chain logic */
    function walkChain(tokens: string[], commandList: Command[]): Command | null {
      if (!tokens.length) return null;
      let depth = 0;
  
      function goDeeper(cmdList: Command[]): Command | null {
        const token = tokens[depth];
        const found = cmdList.find((c) => c.name === token);
        if (found) {
          depth++;
          if (found.subCommands && depth < tokens.length) {
            return goDeeper(found.subCommands);
          }
          return found;
        }
        return null;
      }
  
      return goDeeper(commandList);
    }
  
    function processCommand(fullCommand: string) {
      setHistory((prev) => [...prev, `> ${fullCommand}`]);
      setCommandHistory((prev) => [...prev, fullCommand]);
      setHistoryIndex(-1);
  
      const tokens = fullCommand.split(" ").filter(Boolean);
      if (!tokens.length) return;
  
      const matched = walkChain(tokens, commands);
      if (!matched) {
        setHistory((prev) => [...prev, `&eCommand not found: &r${tokens[0]}`]);
        return;
      }
  
      const remainingArgs = tokens.slice(tokens.indexOf(matched.name) + 1);
      const parsedParams = matched.parseParams(remainingArgs);
      if (!parsedParams) {
        setHistory((prev) => [...prev, `&eInvalid parameters&r. Usage: ${matched.usage}`]);
        return;
      }
  
      const context: CommandContext = {
        allCommands: commands,
        setHistory,
      };
  
      const result = matched.run(remainingArgs, parsedParams, context);
      if (result.status) {
        setHistory((prev) => [...prev, result.status]);
      }
    }
  
    function handleSubmit(e: FormEvent) {
      e.preventDefault();
      const cmd = input.trim();
      if (!cmd) return;
      processCommand(cmd);
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
          setSuggestionIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
          return;
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSuggestionIndex((prev) => Math.max(prev - 1, 0));
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
      if (!splitted.length) {
        setInput(suggestions[suggestionIndex] + " ");
        return;
      }
      splitted[splitted.length - 1] = suggestions[suggestionIndex];
      setInput(splitted.join(" ") + " ");
      setShowSuggestions(false);
      setSuggestions([]);
    }
  
    function updateSuggestions(currentInput: string) {
      if (!currentInput) {
        setSuggestions([]);
        setShowSuggestions(false);
        setSuggestionIndex(0);
        return;
      }
    
      const splitted = currentInput.split(" ");
      const tokens = splitted.filter(Boolean);
    
      if (currentInput.endsWith(" ")) {
        const cmd = walkChain(tokens, commands);
        if (cmd && cmd.subCommands && cmd.subCommands.length > 0) {
          setSuggestions(cmd.subCommands.map((c) => c.name));
          setShowSuggestions(true);
          setSuggestionIndex(0);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
        return;
      }
    
      const allButLast = tokens.slice(0, -1);
      const lastToken = tokens[tokens.length - 1];
      const parent = walkChain(allButLast, commands);
    
      if (!parent) {
        const filtered = commands
          .map((c) => c.name)
          .filter((n) => n.startsWith(lastToken));
        if (filtered.length === 1 && filtered[0] === lastToken) {
          // If there's only one suggestion and it matches exactly, clear suggestions
          setSuggestions([]);
          setShowSuggestions(false);
          return;
        }
        if (filtered.length) {
          setSuggestions(filtered);
          setShowSuggestions(true);
          setSuggestionIndex(0);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
        return;
      }
    
      if (parent.subCommands && parent.subCommands.length > 0) {
        const subfiltered = parent.subCommands
          .map((c) => c.name)
          .filter((n) => n.startsWith(lastToken));
        if (subfiltered.length === 1 && subfiltered[0] === lastToken) {
          // If there's only one suggestion and it matches exactly, clear suggestions
          setSuggestions([]);
          setShowSuggestions(false);
          return;
        }
        if (subfiltered.length) {
          setSuggestions(subfiltered);
          setShowSuggestions(true);
          setSuggestionIndex(0);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
        return;
      }
    
      setSuggestions([]);
      setShowSuggestions(false);
    }
    
  
    let ghostedText = "";
    if (showSuggestions && suggestions.length > 0 && input) {
      const splitted = input.split(" ");
      const lastToken = splitted[splitted.length - 1] || "";
      const suggestion = suggestions[suggestionIndex];
      if (suggestion.startsWith(lastToken)) {
        ghostedText = suggestion.slice(lastToken.length);
      }
    }
  
    function parseLine(line: string): ColorSegment[] {
      return parseColorTokens(line, finalTheme.textColor!);
    }
  
    /** STYLES */
    const consoleContainerStyle: CSSProperties = {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      border: "1px solid #ccc",
      fontFamily: finalTheme.font,
      fontSize: finalTheme.fontSize,
      lineHeight: finalTheme.lineHeight,
      position: "relative",
      // minHeight: "400px",
    };
  
    const outputAreaClass = "console-scroll-area";
  
    const outputAreaStyle: CSSProperties = {
      flexGrow: 1,
      backgroundColor: finalTheme.backgroundColor?.primary,
      color: finalTheme.textColor?.primary,
      padding: "8px",
      whiteSpace: "pre-wrap",
      overflowY: "auto",
    };
  
    const inputContainerStyle: CSSProperties = {
      borderTop: "1px solid #ccc",
      backgroundColor: finalTheme.backgroundColor?.secondary,
      padding: "4px",
      display: "flex",
      alignItems: "center",
      position: "relative",
    };
  
    const inputStyle: CSSProperties = {
      width: "100%",
      padding: "6px",
      border: "none",
      outline: "none",
      background: "transparent",
      color: finalTheme.textColor?.primary,
      fontFamily: finalTheme.font,
      fontSize: finalTheme.fontSize,
      lineHeight: finalTheme.lineHeight,
    };
  
    const runButtonStyle: CSSProperties = {
      padding: "6px 12px",
      border: "none",
      backgroundColor: finalTheme.textColor?.primary,
      color: "#fff",
      marginLeft: "8px",
      cursor: "pointer",
      borderRadius: "4px",
      fontFamily: finalTheme.font,
      fontSize: finalTheme.fontSize,
      lineHeight: finalTheme.lineHeight,
    };
  
    const suggestionsBoxStyle: CSSProperties = {
      position: "absolute",
      bottom: "45px",
      left: "8px",
      backgroundColor: "#222",
      border: "1px solid #555",
      borderRadius: "4px",
      padding: "4px",
      zIndex: 999,
      maxHeight: "120px",
      overflowY: "auto",
      minWidth: "150px",
      fontFamily: finalTheme.font,
      fontSize: finalTheme.fontSize,
      lineHeight: finalTheme.lineHeight,
    };
  
    const suggestionItemStyle = (active: boolean): CSSProperties => ({
      padding: "4px 8px",
      backgroundColor: active ? "#555" : "transparent",
      color: "#fff",
      cursor: "pointer",
      fontFamily: finalTheme.font,
      fontSize: finalTheme.fontSize,
      lineHeight: finalTheme.lineHeight,
    });
  
    const ghostStyle: CSSProperties = {
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
    };
  
    return (
      <div style={consoleContainerStyle}>
        {/* custom scrollbar styling for .console-scroll-area */}
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
  
        <div ref={scrollRef} className={outputAreaClass} style={outputAreaStyle}>
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
  
        <div style={inputContainerStyle}>
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
                style={inputStyle}
                placeholder="Type a command..."
                autoComplete="off"
              />
              {ghostedText && (
                <span style={ghostStyle}>
                  {input}
                  <span style={{ opacity: 0.5 }}>{ghostedText}</span>
                </span>
              )}
            </div>
  
            <button type="submit" style={runButtonStyle}>
              Run
            </button>
          </form>
  
          {showSuggestions && suggestions.length > 0 && (
            <div style={suggestionsBoxStyle}>
              {suggestions.map((sug, idx) => (
                <div
                  key={sug}
                  style={suggestionItemStyle(idx === suggestionIndex)}
                  onMouseEnter={() => setSuggestionIndex(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const splitted = input.split(" ");
                    if (!splitted.length) {
                      setInput(sug + " ");
                    } else {
                      splitted[splitted.length - 1] = sug;
                      setInput(splitted.join(" ") + " ");
                    }
                    setShowSuggestions(false);
                    setSuggestions([]);
                  }}
                >
                  {sug}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  