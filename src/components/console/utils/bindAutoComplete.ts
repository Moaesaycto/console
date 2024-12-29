import { Command } from "../types";

export function bindAutoComplete(commands: Command[]): (args: string[]) => string[] {
  return (args: string[]) => {
    // Handle the case where no arguments are provided
    if (args.length === 0) {
      return commands.map((cmd) => cmd.name);
    }

    const tokens = args;
    const lastToken = tokens[tokens.length - 1] || ""; // The token being typed

    // Function to recursively traverse commands
    function findMatchingSubCommands(tokens: string[], commands: Command[]): Command[] | null {
      if (!tokens.length) return commands; // Return all commands at this level if no more tokens

      const [currentToken, ...remainingTokens] = tokens;

      const matchingCommand = commands.find((cmd) => cmd.name === currentToken);

      if (!matchingCommand) {
        return null; // Token doesn't match any command
      }

      if (!remainingTokens.length) {
        return matchingCommand.subCommands || []; // No more tokens, return subcommands or an empty array
      }

      return findMatchingSubCommands(remainingTokens, matchingCommand.subCommands || []);
    }

    // Check if the command chain so far is valid
    if (!isCommandChainValid(tokens.slice(0, -1), commands)) {
      return [];
    }

    const matchedCommands = findMatchingSubCommands(tokens.slice(0, -1), commands);

    if (matchedCommands) {
      // If there are no subcommands available, stop suggestions
      if (matchedCommands.length === 0) {
        return [];
      }

      // Filter matching subcommands by the last token
      return matchedCommands
        .map((cmd) => cmd.name)
        .filter((name) => name.startsWith(lastToken));
    }

    // Stop suggesting if no matching subcommands are found at the current depth
    return [];
  };
}

function isCommandChainValid(tokens: string[], commandList: Command[]): boolean {
  if (!tokens.length) return true;

  const [currentToken, ...remainingTokens] = tokens;

  const matchingCommand = commandList.find((cmd) => cmd.name === currentToken);

  if (!matchingCommand) {
    return false;
  }

  if (!remainingTokens.length) {
    return true;
  }

  return isCommandChainValid(remainingTokens, matchingCommand.subCommands || []);
}
