import { Command } from "../types";

export function bindAutoComplete(commands: Command[]): (args: string[]) => string[] {
  return (args: string[]) => {
    // If no arguments provided, suggest all top-level commands
    if (args.length === 0) {
      return commands.map((cmd) => cmd.name);
    }

    // Recursively find matching subcommands
    function findSubCommands(tokens: string[], commandList: Command[]): Command[] | null {
      if (!tokens.length) return commandList; // No tokens left, return all commands at this level

      const [currentToken, ...remainingTokens] = tokens;

      const matchingCommand = commandList.find((cmd) => cmd.name === currentToken);

      if (!matchingCommand) {
        return commandList; // May be null in better implementation
      }

      if (!remainingTokens.length) {
        return matchingCommand.subCommands || [];
      }

      return findSubCommands(remainingTokens, matchingCommand.subCommands || []);
    }

    const tokens = args;

    if (!isCommandChainValid(tokens.slice(0, -1), commands)) {
      return [];
    }

    const subCommands = findSubCommands(tokens, commands);

    if (subCommands) {
      return subCommands.map((sub) => sub.name);
    }

    // If no subcommands and the current token matches a valid command, return no suggestions
    const lastToken = tokens[tokens.length - 1] || ""; // Ensure non-empty token
    const validCommand = commands.find((cmd) => cmd.name === lastToken);

    if (validCommand && (!validCommand.subCommands || validCommand.subCommands.length === 0)) {
      return [];
    }

    // Otherwise, suggest top-level commands that match the last token
    return commands
      .map((cmd) => cmd.name)
      .filter((name) => name && name.startsWith(lastToken));
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
