import { Command } from "../types";

export function walkChain(tokens: string[], commandList: Command[]): Command | null {
  if (!tokens.length) return null;
  let depth = 0;

  function goDeeper(cmdList: Command[]): Command | null {
    const token = tokens[depth];
    const found = cmdList.find((c) => c.name === token);
    if (found) {
      depth++;
      if (found.subCommands && found.subCommands.length > 0 && depth < tokens.length) {
        return goDeeper(found.subCommands);
      }
      return found;
    }
    return null;
  }

  return goDeeper(commandList);
}


// Utility function to determine the depth of the token chain for slicing
export function walkChainDepth(tokens: string[], commands: Command[]): number {
  let depth = 0;
  let currentCommands = commands;

  for (const token of tokens) {
    const cmd = currentCommands.find((c) => c.name === token);
    if (!cmd) break;
    depth++;
    currentCommands = cmd.subCommands || [];
  }

  return depth;
}
