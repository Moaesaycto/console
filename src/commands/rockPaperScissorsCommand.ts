import { Command } from "../components/console/types";

export const rpsCommand: Command = {
  name: "rps",
  description: "Play Rock, Paper, Scissors against the console.",
  usage: "rps <rock|paper|scissors>",
  parseParams: (args) => {
    if (args.length !== 1) return null;
    const choice = args[0].toLowerCase();
    if (!["rock", "paper", "scissors"].includes(choice)) return null;
    return { choice };
  },
  run: (_, params) => {
    const userChoice = params.choice;
    const choices = ["rock", "paper", "scissors"];
    const consoleChoice = choices[Math.floor(Math.random() * choices.length)];

    // Determine the result
    let result: string;
    if (userChoice === consoleChoice) {
      result = "It's a tie!";
    } else if (
      (userChoice === "rock" && consoleChoice === "scissors") ||
      (userChoice === "scissors" && consoleChoice === "paper") ||
      (userChoice === "paper" && consoleChoice === "rock")
    ) {
      result = "You win!";
    } else {
      result = "Console wins!";
    }

    return {
      completed: true,
      status: `You chose: ${userChoice}\nConsole chose: ${consoleChoice}\n${result}`,
    };
  },
  autoComplete: (args) => {
    if (args.length === 0) {
      return ["rock", "paper", "scissors"];
    }
    if (args.length === 1) {
      const lastArg = args[0].toLowerCase();
      if (["rock", "paper", "scissors"].includes(lastArg)) {
        return []; // No suggestions if a valid argument is already entered
      }
      return ["rock", "paper", "scissors"].filter((option) =>
        option.startsWith(lastArg)
      );
    }
    return []; // No suggestions beyond the first argument
  },
};
