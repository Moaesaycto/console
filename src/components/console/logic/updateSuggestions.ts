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

  if (endsWithSpace) {
    const foundCmd = walkChain(tokens, commands);

    if (!foundCmd) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const remainingTokens = tokens.slice(tokens.indexOf(foundCmd.name) + 1);

    if (foundCmd.autoComplete) {
      const customSuggestions = foundCmd.autoComplete(remainingTokens);
      if (customSuggestions.length === 0) {
        setSuggestions([]);
        setShowSuggestions(false);
      } else {
        setSuggestions(customSuggestions);
        setShowSuggestions(true);
      }
      return;
    }

    if (foundCmd.subCommands && foundCmd.subCommands.length > 0) {
      const filteredSubCommands = foundCmd.subCommands.map((sub) => sub.name);
      setSuggestions(filteredSubCommands);
      setShowSuggestions(filteredSubCommands.length > 0);
      return;
    }

    setSuggestions([]);
    setShowSuggestions(false);
    return;
  } else {
    // User is typing the last token, suggest completions based on partial match
    const lastToken = tokens[tokens.length - 1];
    const priorTokens = tokens.slice(0, -1);

    if (priorTokens.length === 0) {
      // Suggest top-level commands matching the partial last token
      const filteredCommands = commands
        .map((c) => c.name)
        .filter((name) => name.startsWith(lastToken));

      // If the last token matches exactly one command, and no other options exist, hide autocomplete
      if (
        filteredCommands.length === 1 &&
        filteredCommands[0] === lastToken
      ) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setSuggestions(filteredCommands);
      setShowSuggestions(filteredCommands.length > 0);
      return;
    }

    const foundCmd = walkChain(priorTokens, commands);

    if (!foundCmd) {
      const topLevelMatches = commands
        .map((c) => c.name)
        .filter((name) => name.startsWith(lastToken));
      setSuggestions(topLevelMatches);
      setShowSuggestions(topLevelMatches.length > 0);
      return;
    }

    if (foundCmd.autoComplete) {
      const customSuggestions = foundCmd
        .autoComplete(priorTokens.slice(foundCmd.name ? 1 : 0))
        .filter((s) => s.startsWith(lastToken));

      // Hide suggestions if only one exact match exists
      if (
        customSuggestions.length === 1 &&
        customSuggestions[0] === lastToken
      ) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setSuggestions(customSuggestions);
      setShowSuggestions(customSuggestions.length > 0);
      return;
    }

    if (foundCmd.subCommands && foundCmd.subCommands.length > 0) {
      const filteredSubCommands = foundCmd.subCommands
        .map((sub) => sub.name)
        .filter((name) => name.startsWith(lastToken));

      // Hide suggestions if only one exact match exists
      if (
        filteredSubCommands.length === 1 &&
        filteredSubCommands[0] === lastToken
      ) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setSuggestions(filteredSubCommands);
      setShowSuggestions(filteredSubCommands.length > 0);
      return;
    }

    setSuggestions([]);
    setShowSuggestions(false);
  }
}
