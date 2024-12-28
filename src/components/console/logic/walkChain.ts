import { Command } from "../types";

  /** Command chain logic */
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