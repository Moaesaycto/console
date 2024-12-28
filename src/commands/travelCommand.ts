import { Command } from "../components/console/types";

export const travelCommand: Command = {
    name: "travel",
    description: "Plan a trip with destination, dates, transport, and budget.",
    usage: "travel <destination> <start_date> <duration> <transport> <budget>",
    parseParams: (args) => {
      if (args.length < 5) return null;
  
      const [destination, startDate, durationStr, transport, budget] = args;
      const duration = parseInt(durationStr, 10);
  
      if (!["paris", "tokyo", "newyork", "london"].includes(destination.toLowerCase())) {
        return null;
      }
  
      if (!/^(\d{4})-(\d{2})-(\d{2})$/.test(startDate)) {
        return null; // Validate date format
      }
  
      if (isNaN(duration) || duration <= 0) {
        return null; // Validate duration
      }
  
      if (!["plane", "train", "car", "ship"].includes(transport.toLowerCase())) {
        return null;
      }
  
      if (!["economy", "business", "luxury"].includes(budget.toLowerCase())) {
        return null;
      }
  
      return { destination, startDate, duration, transport, budget };
    },
    run: (_, params) => {
      const { destination, startDate, duration, transport, budget } = params;
      return {
        completed: true,
        status: `Planned a ${duration}-day trip to ${destination}, starting on ${startDate}, via ${transport} in ${budget} class.`,
      };
    },
    autoComplete: (args) => {
      const destinations = ["paris", "tokyo", "newyork", "london"];
      const transports = ["plane", "train", "car", "ship"];
      const budgets = ["economy", "business", "luxury"];
  
      if (args.length === 0) {
        return destinations;
      } else if (args.length === 1) {
        return destinations.filter((dest) => dest.startsWith(args[0].toLowerCase()));
      } else if (args.length === 2) {
        return ["YYYY-MM-DD"]; // Hint for date format
      } else if (args.length === 3) {
        return ["1", "2", "3", "7", "10"]; // Duration options
      } else if (args.length === 4) {
        return transports.filter((transport) =>
          transport.startsWith(args[3].toLowerCase())
        );
      } else if (args.length === 5) {
        return budgets.filter((budget) =>
          budget.startsWith(args[4].toLowerCase())
        );
      }
  
      return [];
    },
  };
  