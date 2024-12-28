import { Command } from "../types";
import { clearCommand, helpCommand } from "./builtInCommands";

export const builtInCommands: Command[] = [
  helpCommand,
  clearCommand
];
