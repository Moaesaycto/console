import { Command } from "../components/console/types";

export const headsOrTailsCommand: Command = {
  name: "coinflip",
  description: "Flips a coin and returns 'Heads' or 'Tails'.",
  usage: "coinflip",
  parseParams: () => ({}),
  run: () => {
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    return {
      completed: true,
      status: `The coin landed on: ${result}`,
    };
  },
};
