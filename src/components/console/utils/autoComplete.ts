// /src/utils/autoComplete.ts

import { Command } from "../types";

/**
 * Given a list of commands and the current tokens (split user input),
 * return possible completions for the *next* token.
 */
export function getSuggestions(
  commands: Command[],
  tokens: string[]
): string[] {
  // If no tokens, suggest top-level command names
  if (tokens.length === 0) {
    return commands.map((cmd) => cmd.name);
  }

  // If the user is still typing the first token
  if (tokens.length === 1) {
    const partial = tokens[0];
    // Suggest commands whose names start with the partial
    return commands
      .map((cmd) => cmd.name)
      .filter((name) => name.startsWith(partial));
  }

  // If the user already typed a valid top-level command, 
  // we look for subcommands for the second token
  const topLevelCmd = commands.find((cmd) => cmd.name === tokens[0]);
  if (!topLevelCmd) {
    // If first token is not a known command, then no suggestions
    return [];
  }

  // If only 1 token so far (which is the recognized command),
  // we want to suggest its subCommands
  if (tokens.length === 2) {
    const partialSub = tokens[1];
    if (!topLevelCmd.subCommands || topLevelCmd.subCommands.length === 0) {
      return [];
    }
    return topLevelCmd.subCommands
      .map((sub) => sub.name)
      .filter((name) => name.startsWith(partialSub));
  }

  // If we have more than 2 tokens, let's see if the second token matches a subCommand
  const subCmdName = tokens[1];
  const subCmd = topLevelCmd.subCommands?.find(
    (sc) => sc.name === subCmdName
  );
  if (!subCmd) {
    return [];
  }

  // If the user typed something like "hello day X", that "X" might be the user’s name,
  // which we do NOT want to auto-complete. If the subcommand has subCommands,
  // we can continue the logic, but let's keep it simple:
  if (tokens.length === 2) {
    // We already handled the partial above, so we might skip.
    return [];
  } else if (tokens.length === 3) {
    // The third token might be partial sub-subcommand if subCmd has subCommands
    const partialSub2 = tokens[2];
    if (!subCmd.subCommands || subCmd.subCommands.length === 0) {
      return [];
    }
    return subCmd.subCommands
      .map((s) => s.name)
      .filter((name) => name.startsWith(partialSub2));
  }

  // And so on if you want deeper recursion...
  return [];
}
