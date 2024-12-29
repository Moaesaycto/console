import { Command } from "../components/console/types";

export const randomCommand: Command = {
  name: "random",
  description: "Generates a random number between <min> and <max>.",
  usage: "random <min> <max>",
  parseParams: (args) => {
    if (args.length < 2) return null;
    const min = parseFloat(args[0]);
    const max = parseFloat(args[1]);
    if (isNaN(min) || isNaN(max) || min > max) return null;
    return { min, max };
  },
  run: (_, params, __) => {
    const result = (Math.random() * (params.max - params.min) + params.min).toFixed(2);
    return {
      completed: true,
      status: `Random number between ${params.min} and ${params.max}: ${result}`,
    };
  },
};
