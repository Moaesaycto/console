// /src/types.ts

import React from "react";

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

  /** Add other console-level state or methods here if needed. */
}

/**
 * A single command definition.
 */
export interface Command {
  /** The name the user types to invoke this command. */
  name: string;

  /** A brief description of the command (shown in help). */
  description: string;

  /** Optional list of nested subcommands. */
  subCommands?: Command[];

  /** Default parameters for the command if needed. */
  defaults?: Record<string, string>;

  /** Usage string for help output (e.g., "hello day <name> [--time=true]") */
  usage: string;

  /**
   * parseParams: Convert user input (remaining args) into a structured
   * object or null (null => invalid usage).
   */
  parseParams: (args: string[]) => Record<string, any> | null;

  /**
   * run: Execute the command logic.
   * context gives access to allCommands and setHistory.
   */
  run: (
    args: string[],
    params: Record<string, any>,
    context: CommandContext
  ) => { completed: boolean; status: string };
}
