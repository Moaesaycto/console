import { Command } from "../components/console/types";

export const jokeCommand: Command = {
    name: "joke",
    description: "Tells a random joke.",
    usage: "joke",
    parseParams: () => ({}),
    run: () => {
      const jokes = [
        "Why don't skeletons fight each other? They don't have the guts.",
        "What do you call cheese that isn't yours? Nacho cheese.",
        "Why couldn't the bicycle stand up by itself? It was two-tired.",
        "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      ];
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      return {
        completed: true,
        status: joke,
      };
    },
  };
  