// /src/commands/builtInCommands.ts

import { Command, CommandContext } from "../types";

/** Clears the console output */
export const clearCommand: Command = {
  name: "clear",
  description: "Clears the console output",
  usage: "clear",
  parseParams: () => ({}),
  run: (args, params, context: CommandContext) => {
    void args, params;
    context.setHistory([]);
    return { completed: true, status: "" };
  },
};

/** Utility: find command chain by tokens */
function findCommandChain(tokens: string[], commands: Command[]): Command | null {
  if (!tokens.length) return null;
  const [first, ...rest] = tokens;
  const found = commands.find((c) => c.name === first);
  if (!found) return null;
  if (!rest.length) return found;
  if (found.subCommands && found.subCommands.length > 0) {
    return findCommandChain(rest, found.subCommands);
  }
  return found;
}

/** Utility: simple pagination for top-level commands, 10 per page */
function paginateCommands(
  cmds: Command[],
  page: number,
  pageSize = 10
): { items: Command[]; totalPages: number } {
  const totalPages = Math.ceil(cmds.length / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const items = cmds.slice(startIndex, startIndex + pageSize);
  return { items, totalPages };
}

/** Utility: build usage text for a single command */
function buildCommandHelp(cmd: Command) {
  let subcommandsInfo = "";
  if (cmd.subCommands && cmd.subCommands.length > 0) {
    subcommandsInfo =
      "Arguments:\n" +
      cmd.subCommands
        .map((sc) => `- ${sc.name.padEnd(16, ".")} ${sc.description}`)
        .join("\n");
  }

  let parameters = "";
  if (cmd.defaults && Object.keys(cmd.defaults).length > 0) {
    parameters =
      "Parameters:\n" +
      Object.keys(cmd.defaults)
        .map((p) => `--${p}`)
        .join("\n");
  }

  return [
    cmd.name.toUpperCase(),
    cmd.description,
    `Usage: ${cmd.usage}`,
    subcommandsInfo,
    parameters,
  ]
    .filter(Boolean)
    .join("\n");
}

/** The "help" command */
export const helpCommand: Command = {
  name: "help",
  description: "Displays help information about commands",
  usage: "help [command] [subcommand ...] [--page=#]",
  parseParams: (args) => {
    let page = 1;
    const filteredArgs: string[] = [];
    args.forEach((arg) => {
      if (arg.startsWith("--page=")) {
        const pg = parseInt(arg.split("=")[1], 10);
        if (!isNaN(pg) && pg > 0) page = pg;
      } else {
        filteredArgs.push(arg);
      }
    });
    return { tokens: filteredArgs, page };
  },
  run: (args, params, context: CommandContext) => {
    void args;
    
    const { tokens, page } = params;
    const allCmds = context.allCommands;

    // CASE A: No tokens => list top-level commands in pages of 10
    if (!tokens || tokens.length === 0) {
      const { items, totalPages } = paginateCommands(allCmds, page, 10);
      let output = `GENERAL HELP | [Page ${page}/${totalPages}]\n`;
      output += "For more info on a specific command, type help command-name\n\n";
      items.forEach((c) => {
        output += `${c.name.padEnd(24, ".")}${c.description}\n`;
      });
      if (totalPages > 1) {
        output += `\nUse --page=X to see other pages.\n`;
      }
      return { completed: true, status: output };
    }

    // CASE B: "help someCommand [subCommand]"
    const found = findCommandChain(tokens, allCmds);
    if (!found) {
      return { completed: false, status: `Command not found: ${tokens.join(" ")}` };
    }

    const helpText = buildCommandHelp(found);
    return { completed: true, status: helpText };
  },
};
