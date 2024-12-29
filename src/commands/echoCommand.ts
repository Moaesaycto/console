import { Command } from "../components/console/types";

export const echoCommand: Command = {
  name: "echo",
  description: "Repeats back the provided input.",
  usage: "echo <message>",
  parseParams: (args) => {
    if (args.length === 0) return null;
    return { message: args.join(" ") };
  },
  run: (_, params, __) => {
    return {
      completed: true,
      status: params.message,
    };
  },
};
