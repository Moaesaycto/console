/**
 * CommandContext allows built-in or user-defined commands
 * to access the console's state: the full command list
 * and a function to modify the console history.
 */
export interface CommandContext {
  /** Full array of all commands (including built-ins) */
  allCommands: Command[];

  /** Allows a command (like "clear") to wipe the console history */
  setHistory: React.Dispatch<React.SetStateAction<string[]>>;
}

/**
 * A single command definition.
 */
export interface Command {
  name: string;
  description: string;
  usage: string;
  defaults?: Record<string, string>;
  subCommands?: Command[]; // Supports nested subcommands
  parseParams: (args: string[]) => Record<string, any> | null;
  run: (args: string[], params: Record<string, any>, context: CommandContext) => {
    completed: boolean;
    status: string;
  };
  autoComplete?: (args: string[]) => string[]; // Suggests custom arguments
}