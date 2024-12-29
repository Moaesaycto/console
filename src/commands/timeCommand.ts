import { Command } from "../components/console/types";

export const timeCommand: Command = {
  name: "time",
  description: "Displays the current date and time.",
  usage: "time",
  parseParams: () => ({}),
  run: (_, __, ___) => {
    const now = new Date();
    return {
      completed: true,
      status: `Current Time: ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}`,
    };
  },
};
