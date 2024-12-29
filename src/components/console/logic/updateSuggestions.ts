import { Command } from "../types";
import { walkChain, walkChainDepth } from "./walkChain";

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

  if (tokens[0] === "help" && endsWithSpace) {
    tokens.push("");
  }

  if (tokens.length === 1 && !endsWithSpace) {
    const firstToken = tokens[0];
    const filteredCommands = commands
      .map((c) => c.name)
      .filter((name) => name && name.startsWith(firstToken));

    if (filteredCommands.length === 1 && filteredCommands[0] === firstToken) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSuggestions(filteredCommands);
    setShowSuggestions(filteredCommands.length > 0);
    return;
  }

  const firstToken = tokens[0];
  const validTopLevelCommand = commands.find((cmd) => cmd.name === firstToken);

  if (!validTopLevelCommand) {
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

    if (foundCmd.subCommands && foundCmd.subCommands.length > 0) {
      const subcommandSuggestions = foundCmd.subCommands.map((sub) => sub.name);
      setSuggestions(subcommandSuggestions);
      setShowSuggestions(subcommandSuggestions.length > 0);
      return;
    }

    if (foundCmd.autoComplete) {
      // Pass only the tokens relevant to the command's context
      const commandContextTokens = tokens.slice(walkChainDepth(tokens, commands));
      const customSuggestions = foundCmd.autoComplete(commandContextTokens);
      setSuggestions(customSuggestions);
      setShowSuggestions(customSuggestions.length > 0);
      return;
    }

    setSuggestions([]);
    setShowSuggestions(false);
    return;
  } else {
    const lastToken = tokens[tokens.length - 1] || "";
    const priorTokens = tokens.slice(0, -1);

    const foundCmd = walkChain(priorTokens, commands);

    if (!foundCmd) {
      const topLevelMatches = commands
        .map((c) => c.name)
        .filter((name) => name && name.startsWith(lastToken));
      setSuggestions(topLevelMatches);
      setShowSuggestions(topLevelMatches.length > 0);
      return;
    }

    if (foundCmd.subCommands && foundCmd.subCommands.length > 0) {
      const filteredSubCommands = foundCmd.subCommands
        .map((sub) => sub.name)
        .filter((name) => name && name.startsWith(lastToken));

      if (filteredSubCommands.length === 1 && filteredSubCommands[0] === lastToken) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setSuggestions(filteredSubCommands);
      setShowSuggestions(filteredSubCommands.length > 0);
      return;
    }

    if (foundCmd.autoComplete) {
      // Pass only the tokens relevant to the command's context
      const commandContextTokens = tokens.slice(walkChainDepth(tokens, commands));
      const customSuggestions = foundCmd
        .autoComplete(commandContextTokens)
        .filter((s) => s.toLowerCase().startsWith(lastToken.toLowerCase()));

      if (customSuggestions.length === 1 && customSuggestions[0].toLowerCase() === lastToken.toLowerCase()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setSuggestions(customSuggestions);
      setShowSuggestions(customSuggestions.length > 0);
      return;
    }

    setSuggestions([]);
    setShowSuggestions(false);
  }
}
