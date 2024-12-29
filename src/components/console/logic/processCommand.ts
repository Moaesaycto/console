import { Command, CommandContext } from "../types";
import { Dispatch, SetStateAction } from "react";
import { walkChain } from "../logic/walkChain";

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
