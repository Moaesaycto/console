import { Command } from "../types";

export function bindAutoComplete(commands: Command[]): (args: string[]) => string[] {
  return (args: string[]) => {
    if (args.length === 0) {
      return commands.map((cmd) => cmd.name);
    }

    // Function to recursively find the subcommands
    function findMatchingSubCommands(tokens: string[], commandList: Command[]): Command[] | null {
      if (!tokens.length) return commandList;

      const [currentToken, ...remainingTokens] = tokens;

      const matchingCommand = commandList.find((cmd) => cmd.name === currentToken);

      if (!matchingCommand) {
        return null; // Invalid chain, stop searching
      }

      if (!remainingTokens.length) {
        // If this is the last token, return the subcommands if available
        return matchingCommand.subCommands || null;
      }

      return findMatchingSubCommands(remainingTokens, matchingCommand.subCommands || []);
    }

    const tokens = args;
    const lastToken = tokens[tokens.length - 1] || "";

    // Validate the command chain so far
    if (!isCommandChainValid(tokens.slice(0, -1), commands)) {
      return [];
    }

    const matchedCommands = findMatchingSubCommands(tokens.slice(0, -1), commands);

    if (matchedCommands) {
      // If there are no subcommands to suggest, return an empty list
      if (matchedCommands.length === 0) {
        return [];
      }

      // Suggest matching subcommands based on the last token
      return matchedCommands
        .map((cmd) => cmd.name)
        .filter((name) => name.startsWith(lastToken));
    }

    // If no subcommands are found, do not fall back to top-level commands
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
