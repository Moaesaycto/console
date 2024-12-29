import { Command, CommandContext } from "../types";
import { Dispatch, SetStateAction } from "react";
import { walkChain } from "../logic/walkChain";

function tokenizeCommand(input: string): string[] {
  const tokens: string[] = [];
  let currentToken = "";
  let insideQuotes: boolean = false;
  let quoteChar: string | null = null;

  for (const char of input) {
    if (insideQuotes) {
      if (char === quoteChar) {
        // End of quoted string
        insideQuotes = false;
        quoteChar = null;
      } else {
        // Accumulate quoted characters
        currentToken += char;
      }
    } else {
      if (char === '"' || char === "'") {
        // Start of a quoted string
        insideQuotes = true;
        quoteChar = char;
      } else if (char === " ") {
        // Token separator
        if (currentToken) {
          tokens.push(currentToken);
          currentToken = "";
        }
      } else {
        // Accumulate unquoted characters
        currentToken += char;
      }
    }
  }

  // Push the last token if any
  if (currentToken) {
    tokens.push(currentToken);
  }

  if (insideQuotes) {
    throw new Error("Unclosed quote in command input");
  }

  return tokens;
}

export function processCommand(
  fullCommand: string,
  commands: Command[],
  setHistory: Dispatch<SetStateAction<string[]>>,
  setCommandHistory: Dispatch<SetStateAction<string[]>>,
  setHistoryIndex: Dispatch<SetStateAction<number>>
) {
  setHistory((prev) => [...prev, `> ${fullCommand}`]);
  setCommandHistory((prev) => [...prev, fullCommand]);
  setHistoryIndex(-1);

  let tokens: string[];
  try {
    tokens = tokenizeCommand(fullCommand);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    setHistory((prev) => [...prev, `&eError: ${errorMessage}&r`]);
    return;
  }

  if (!tokens.length) return;

  const matched = walkChain(tokens, commands);
  if (!matched) {
    setHistory((prev) => [...prev, `&eCommand not found: &r${tokens[0]}`]);
    return;
  }

  const remainingArgs = tokens.slice(tokens.indexOf(matched.name) + 1);
  const parsedParams = matched.parseParams(remainingArgs);
  if (!parsedParams) {
    setHistory((prev) => [
      ...prev,
      `&eInvalid parameters&r. Usage: ${matched.usage}`,
    ]);
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
