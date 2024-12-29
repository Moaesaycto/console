import { Command } from "../types";

export function bindAutoComplete(commands: Command[]): (args: string[]) => string[] {
  return (args: string[]) => {
    // Case 1: No arguments, show all top-level commands
    if (args.length === 0) {
      return commands.map((cmd) => cmd.name); // Suggest all top-level commands
    }

    // Case 2: User has typed "commandName" or part of it
    const tokens = args; // `args` directly represents the command tokens

    // Traverse recursively to find the matching command or subcommand
    function findSubCommands(tokens: string[], cmds: Command[]): Command[] | null {
      if (!tokens.length) return cmds;

      const [currentToken, ...remainingTokens] = tokens;
      const found = cmds.find((cmd) => cmd.name === currentToken);

      if (!found) return null;

      if (!remainingTokens.length) {
        // If this is the last token, return its subcommands (if any)
        return found.subCommands || [];
      }

      // Continue recursively with remaining tokens
      return findSubCommands(remainingTokens, found.subCommands || []);
    }

    // Find matching subcommands for the given tokens
    const matchedSubCommands = findSubCommands(tokens, commands);

    if (matchedSubCommands) {
      return matchedSubCommands.map((sub) => sub.name); // Suggest subcommands
    }

    // If the command doesn't exist or has no subcommands, return no suggestions
    return [];
  };
}
