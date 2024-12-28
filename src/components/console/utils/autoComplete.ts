import { Command } from "../types";

/**
 * Given a list of commands and the current tokens (split user input),
 * return possible completions for the *next* token at any level of recursion.
 */
export function getSuggestions(
  commands: Command[],
  tokens: string[]
): string[] {
  if (tokens.length === 0) {
    return commands.map((cmd) => cmd.name);
  }

  const [currentToken, ...remainingTokens] = tokens;
  const matchingCommand = commands.find((cmd) => cmd.name === currentToken);

  if (!remainingTokens.length) {
    return commands
      .map((cmd) => cmd.name)
      .filter((name) => name.startsWith(currentToken));
  }

  if (!matchingCommand) {
    return [];
  }

  if (remainingTokens.length > 0) {
    if (!matchingCommand.subCommands || matchingCommand.subCommands.length === 0) {
      return [];
    }
    return getSuggestions(matchingCommand.subCommands, remainingTokens);
  }

  return [];
}
