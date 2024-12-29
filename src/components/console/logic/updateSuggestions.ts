import { Command } from "../types";
import { walkChain } from "../logic/walkChain";

export function updateSuggestions(
  currentInput: string,
  commands: Command[],
  setSuggestions: (suggestions: string[]) => void,
  setShowSuggestions: (show: boolean) => void,
  setSuggestionIndex: (index: number) => void
) {
  if (!currentInput) {
    setSuggestions([]);
    setShowSuggestions(false);
    setSuggestionIndex(0);
    return;
  }

  const endsWithSpace = currentInput.endsWith(" ");
  const tokens = currentInput.trim().split(" ").filter((t) => t !== "");

  // Handle top-level command suggestions if only the first token is being typed
  if (tokens.length === 1 && !endsWithSpace) {
    const firstToken = tokens[0];
    const filteredCommands = commands
      .map((c) => c.name)
      .filter((name) => name.startsWith(firstToken));

    // Suppress suggestions if the token matches exactly one valid command
    if (filteredCommands.length === 1 && filteredCommands[0] === firstToken) {
      const matchedCommand = commands.find((cmd) => cmd.name === firstToken);
      if (
        !matchedCommand?.subCommands?.length &&
        !matchedCommand?.autoComplete
      ) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
    }

    setSuggestions(filteredCommands);
    setShowSuggestions(filteredCommands.length > 0);
    return;
  }

  // Check if the first token matches a valid top-level command
  const firstToken = tokens[0];
  const validTopLevelCommand = commands.find((cmd) => cmd.name === firstToken);

  if (!validTopLevelCommand) {
    // If the first token is not a valid command, hide suggestions
    setSuggestions([]);
    setShowSuggestions(false);
    setSuggestionIndex(0);
    return;
  }

  if (endsWithSpace) {
    const foundCmd = walkChain(tokens, commands);

    if (!foundCmd) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // If command has subcommands, suggest them
    if (foundCmd.subCommands && foundCmd.subCommands.length > 0) {
      const subcommandSuggestions = foundCmd.subCommands.map((sub) => sub.name);
      setSuggestions(subcommandSuggestions);
      setShowSuggestions(subcommandSuggestions.length > 0);
      return;
    }

    // If no subcommands but `autoComplete` exists, suggest arguments
    if (foundCmd.autoComplete) {
      const customSuggestions = foundCmd.autoComplete(tokens.slice(1));
      setSuggestions(customSuggestions);
      setShowSuggestions(customSuggestions.length > 0);
      return;
    }

    setSuggestions([]);
    setShowSuggestions(false);
    return;
  } else {
    // User is typing the last token, suggest completions based on partial match
    const lastToken = tokens[tokens.length - 1];
    const priorTokens = tokens.slice(0, -1);

    const foundCmd = walkChain(priorTokens, commands);

    if (!foundCmd) {
      const topLevelMatches = commands
        .map((c) => c.name)
        .filter((name) => name.startsWith(lastToken));
      setSuggestions(topLevelMatches);
      setShowSuggestions(topLevelMatches.length > 0);
      return;
    }

    if (foundCmd.subCommands && foundCmd.subCommands.length > 0) {
      const filteredSubCommands = foundCmd.subCommands
        .map((sub) => sub.name)
        .filter((name) => name.startsWith(lastToken));

      setSuggestions(filteredSubCommands);
      setShowSuggestions(filteredSubCommands.length > 0);
      return;
    }

    if (foundCmd.autoComplete) {
      const customSuggestions = foundCmd
        .autoComplete(tokens.slice(1)) // Pass arguments properly
        .filter((s) => s.toLowerCase().startsWith(lastToken.toLowerCase()));

      setSuggestions(customSuggestions);
      setShowSuggestions(customSuggestions.length > 0);
      return;
    }

    setSuggestions([]);
    setShowSuggestions(false);
  }
}
