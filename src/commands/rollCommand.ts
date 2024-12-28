import { Command } from "../components/console/types";

export const rollCommand: Command = {
    name: "roll",
    description: "Rolls dice. Specify the number of sides and rolls.",
    usage: "roll <sides> <rolls>",
    parseParams: (args) => {
      if (args.length < 2) return null;
      const sides = parseInt(args[0], 10);
      const rolls = parseInt(args[1], 10);
      if (isNaN(sides) || isNaN(rolls) || sides <= 0 || rolls <= 0) return null;
      return { sides, rolls };
    },
    run: (_, params, __) => {
      const results = [];
      for (let i = 0; i < params.rolls; i++) {
        results.push(Math.floor(Math.random() * params.sides) + 1);
      }
      return {
        completed: true,
        status: `Rolled ${params.rolls} dice with ${params.sides} sides: [${results.join(", ")}]`,
      };
    },
  };
  