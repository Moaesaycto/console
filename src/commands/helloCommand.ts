import { Command, CommandContext } from "../components/console/types";

function parseFlags(args: string[]): { sender?: string; remainingArgs: string[] } {
  let sender: string | undefined;
  const remainingArgs: string[] = [];

  args.forEach((arg) => {
    if (arg.startsWith("--sender=")) {
      const value = arg.slice("--sender=".length);

      // Handle quoted values with regex to match entire quoted string
      const match = value.match(/^"(.*)"$/);
      if (match) {
        sender = match[1]; // Extract value inside quotes
      } else {
        sender = value; // Use the entire value if unquoted
      }
    } else {
      remainingArgs.push(arg); // Non-flag arguments
    }
  });

  return { sender, remainingArgs };
}

const dayCommand: Command = {
  name: "day",
  description: "Greets you with 'Good day'",
  usage: "hello day <name> [--sender=<name>]",
  parseParams: (args) => {
    if (args.length < 1) return null;

    const { sender, remainingArgs } = parseFlags(args);

    const [name] = remainingArgs;
    if (!name) return null;

    return { name, sender };
  },
  run: (args, params, context: CommandContext) => {
    void args, context;

    return {
      completed: true,
      status: `Good day, ${params.name}!${params.sender ? ` (from ${params.sender})` : ""}`,
    };
  },
};

const nightCommand: Command = {
  name: "night",
  description: "Greets you with 'Good night'",
  usage: "hello night <name> [--sender=<name>]",
  parseParams: (args) => {
    if (args.length < 1) return null;

    const { sender, remainingArgs } = parseFlags(args);

    const [name] = remainingArgs;
    if (!name) return null;

    return { name, sender };
  },
  run: (args, params, context: CommandContext) => {
    void args, context;

    return {
      completed: true,
      status: `Good night, ${params.name}!${params.sender ? ` (from ${params.sender})` : ""}`,
    };
  },
};

export const helloCommand: Command = {
  name: "hello",
  description: "Root command for greetings",
  usage: "hello <day/night> <name> [--sender=<name>]",
  parseParams: (args) => {
    void args;
    return {};
  },
  run: (args, params, context: CommandContext) => {
    void params, context;

    if (!args.length) {
      return {
        completed: false,
        status: `&eFailed to run HELLO&r\nUsage: ${helloCommand.usage}`,
      };
    }
    // If they typed something else that doesn't match subCommands, we can show usage
    return {
      completed: false,
      status: `Unknown subcommand: ${args[0]}\nUsage: ${helloCommand.usage}`,
    };
  },
  subCommands: [dayCommand, nightCommand],
};
