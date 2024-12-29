import React from "react";

export interface ThemeColorSet {
  primary?: string;
  secondary?: string;
  warning?: string;
  error?: string;
  default?: string; // fallback
}

export interface CommandContext {
  allCommands: Command[];
  setHistory: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface Command {
  name: string;
  description: string;
  usage: string;
  defaults?: Record<string, string>;
  subCommands?: Command[];
  parseParams: (args: string[]) => Record<string, any> | null;
  run: (
    args: string[],
    params: Record<string, any>,
    context: CommandContext
  ) => { completed: boolean; status: string };
  autoComplete?: (args: string[]) => string[];
}

export interface ConsoleTheme {
  font?: string;
  fontSize?: string;
  lineHeight?: string;
  textColor?: ThemeColorSet; // Updated to match theme.ts
  backgroundColor?: ThemeColorSet; // Also updated for consistency
  scrollColor?: ThemeColorSet; // Also updated for consistency
}
