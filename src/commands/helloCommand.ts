import { Command, CommandContext } from "../components/console/types";

const dayCommand: Command = {
  name: "day",
  description: "Greets you with 'Good day'",
  usage: "hello day <name> [--time=true/false]",
  parseParams: (args) => {
    if (args.length < 1) return null;
    const [name, ...flags] = args;
    let time = "true";

    flags.forEach((f) => {
      if (f.startsWith("--time=")) {
        time = f.split("=")[1];
      }
    });

    if (!name) return null;
    return { name, time };
  },
  run: (args, params, context: CommandContext) => {
    void args, context; // Not needed
    
    return {
      completed: true,
      status: `Good day, ${params.name}! (time=${params.time})`,
    };
  },
};

const nightCommand: Command = {
  name: "night",
  description: "Greets you with 'Good night'",
  usage: "hello night <name> [--time=true/false]",
  parseParams: (args) => {
    if (args.length < 1) return null;
    const [name, ...flags] = args;
    let time = "true";

    flags.forEach((f) => {
      if (f.startsWith("--time=")) {
        time = f.split("=")[1];
      }
    });

    if (!name) return null;
    return { name, time };
  },
  run: (args, params, context: CommandContext) => {
    void args, context;

    return {
      completed: true,
      status: `Good night, ${params.name}! (time=${params.time})`,
    };
  },
};

export const helloCommand: Command = {
  name: "hello",
  description: "Root command for greetings",
  usage: "hello <day/night> <name> [--time=true/false]",
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
