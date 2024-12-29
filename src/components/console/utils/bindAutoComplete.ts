import { Command } from "../types";

export function bindAutoComplete(commands: Command[]): (args: string[]) => string[] {
  return (args: string[]) => {
    // If no arguments provided, suggest all top-level commands
    if (args.length === 0) {
      return commands.map((cmd) => cmd.name);
    }

    // Helper function: Recursively find matching subcommands
    function findSubCommands(tokens: string[], commandList: Command[]): Command[] | null {
      if (!tokens.length) return commandList; // No tokens left, return all commands at this level

      const [currentToken, ...remainingTokens] = tokens;
      const matchingCommand = commandList.find((cmd) => cmd.name === currentToken);

      if (!matchingCommand) {
        // No matching command found at this level
        return null;
      }

      if (remainingTokens.length === 0) {
        // If no more tokens, return its subcommands (if any)
        return matchingCommand.subCommands || [];
      }

      // Recursively process remaining tokens
      return findSubCommands(remainingTokens, matchingCommand.subCommands || []);
    }

    // Traverse recursively to find matching commands or subcommands
    const tokens = args;
    const subCommands = findSubCommands(tokens, commands);

    if (subCommands) {
      return subCommands.map((sub) => sub.name);
    }

    // Check if the command is fully typed and has no subcommands
    const lastToken = tokens[tokens.length - 1];
    const validCommand = commands.find((cmd) => cmd.name === lastToken);

    if (validCommand && (!validCommand.subCommands || validCommand.subCommands.length === 0)) {
      // Fully typed command with no subcommands; stop suggesting
      return [];
    }

    // Otherwise, suggest top-level commands that match the last token
    return commands
      .map((cmd) => cmd.name)
      .filter((name) => name.startsWith(lastToken));
  };
}
