import { Command, CommandContext } from "../components/console/types";

export const testCommand: Command = {
  name: "test",
  description: "Root command for comprehensive testing scenarios",
  usage: "test <level1> <subcommand> [args]",
  parseParams: () => ({}),
  run: (args, params, context: CommandContext) => {
    void params, context;

    return {
      completed: false,
      status: `Unknown subcommand: ${args[0] || ""}\nUsage: ${testCommand.usage}`,
    };
  },
  subCommands: [
    // Level 1 Subcommand: Operations
    {
      name: "operations",
      description: "Math and string operations",
      usage: "test operations <math/string> [args]",
      parseParams: () => ({}),
      run: (args, params, context: CommandContext) => {
        void params, context;
        return {
          completed: false,
          status: `Unknown subcommand: ${args[0] || ""}\nUsage: ${testCommand.usage}`,
        };
      },
      subCommands: [
        {
          name: "math",
          description: "Perform basic math operations",
          usage: "test operations math <add/sub/mul/div> <num1> <num2>",
          parseParams: (args) => {
            if (args.length < 3) return null;
            const [operation, num1, num2] = args;
            return { operation, num1: parseFloat(num1), num2: parseFloat(num2) };
          },
          run: (args, params, context: CommandContext) => {
            void args, context;
            const { operation, num1, num2 } = params;
            if (isNaN(num1) || isNaN(num2)) {
              return { completed: false, status: "Invalid numbers provided." };
            }
            let result;
            switch (operation) {
              case "add":
                result = num1 + num2;
                break;
              case "sub":
                result = num1 - num2;
                break;
              case "mul":
                result = num1 * num2;
                break;
              case "div":
                if (num2 === 0) return { completed: false, status: "Cannot divide by zero." };
                result = num1 / num2;
                break;
              default:
                return { completed: false, status: `Unknown operation: ${operation}` };
            }
            return { completed: true, status: `Result of ${operation}: ${result}` };
          },
          autoComplete: (args) => {
            const operations = ["add", "sub", "mul", "div"];

            if (args.length === 0) {
              return operations;
            }

            if (args.length === 1) {
              const currentInput = args[0];
              if (!operations.includes(currentInput)) {
                return operations.filter((op) => op.startsWith(currentInput));
              }
              return [];
            }

            return [];
          },
        },
        {
          name: "string",
          description: "Perform string transformations",
          usage: "test operations string <reverse/uppercase/lowercase> <text>",
          parseParams: (args) => {
            if (args.length < 2) return null;
            const [operation, ...textParts] = args;
            return { operation, text: textParts.join(" ") };
          },
          run: (args, params, context: CommandContext) => {
            void args, context;
            const { operation, text } = params;
            let result;
            switch (operation) {
              case "reverse":
                result = text.split("").reverse().join("");
                break;
              case "uppercase":
                result = text.toUpperCase();
                break;
              case "lowercase":
                result = text.toLowerCase();
                break;
              default:
                return { completed: false, status: `Unknown operation: ${operation}` };
            }
            return { completed: true, status: `Result: ${result}` };
          },
          autoComplete: (args) => {
            const operations = ["reverse", "uppercase", "lowercase"];

            if (args.length === 0) {
              return operations;
            }

            if (args.length === 1) {
              const currentInput = args[0];
              if (!operations.includes(currentInput)) {
                return operations.filter((op) => op.startsWith(currentInput));
              }
              return [];
            }

            return [];
          },
        },
      ],
    },
    // Level 1 Subcommand: Games
    {
      name: "games",
      description: "Play interactive games",
      usage: "test games <rps/coinflip>",
      parseParams: () => ({}),
      run: (args, params, context: CommandContext) => {
        void params, context;
        return { completed: false, status: `Unknown subcommand: ${args[0] || ""}\nUsage: ${testCommand.usage}` };
      },
      subCommands: [
        {
          name: "rps",
          description: "Play Rock, Paper, Scissors",
          usage: "test games rps <rock|paper|scissors>",
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
            let result;
            if (userChoice === consoleChoice) result = "It's a tie!";
            else if (
              (userChoice === "rock" && consoleChoice === "scissors") ||
              (userChoice === "scissors" && consoleChoice === "paper") ||
              (userChoice === "paper" && consoleChoice === "rock")
            ) result = "You win!";
            else result = "Console wins!";
            return { completed: true, status: `You chose: ${userChoice}\nConsole chose: ${consoleChoice}\n${result}` };
          },
          autoComplete: (args) => {
            if (args.length === 0) {
              return ["rock", "paper", "scissors"];
            }
            if (args.length === 1) {
              const lastArg = args[0].toLowerCase();
              if (["rock", "paper", "scissors"].includes(lastArg)) {
                return [];
              }
              return ["rock", "paper", "scissors"].filter((option) => option.startsWith(lastArg));
            }
            return [];
          },
        },
        {
          name: "coinflip",
          description: "Flip a coin",
          usage: "test games coinflip",
          parseParams: () => ({}),
          run: () => {
            const result = Math.random() < 0.5 ? "Heads" : "Tails";
            return { completed: true, status: `The coin landed on: ${result}` };
          },
          autoComplete: () => {
            return []; // No auto-completion for coinflip
          },
        },
      ],
    },
  ],
};
