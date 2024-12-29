# Custom Console

If you like what I do, consider visiting my website [here](https://moaesaycto.github.io/)! I like to make things, and I'm slowly but surely making more things for you to see and use if you want to.

> ### Disclaimer
> This project is provided "as is" without any warranties or guarantees. Use it at your own risk. I'm not responsible for any damage or issues that may arise from using this project. Contributions and feedback are welcome, though I can't promise I'll have the time to change things around. Most of what I do is for simple and fun projects.

---

# Table of Contents

- [Custom Console](#custom-console)
- [Table of Contents](#table-of-contents)
  - [Setting up](#setting-up)
  - [Adding a Starting Message](#adding-a-starting-message)
    - [Example](#example)
  - [Adding Custom Themes](#adding-custom-themes)
    - [Example](#example-1)
  - [Custom Commands](#custom-commands)
    - [1. **Understand the `Command` Interface**](#1-understand-the-command-interface)
    - [2. **Example of a Simple Command**](#2-example-of-a-simple-command)
    - [3. **Nested Commands (Subcommands)**](#3-nested-commands-subcommands)
    - [4. **Ensuring Parameters Are Valid**](#4-ensuring-parameters-are-valid)
    - [5. **Autofill and Suggestions**](#5-autofill-and-suggestions)
      - [Custom Autofill](#custom-autofill)
      - [How Autofill Works](#how-autofill-works)
    - [6. **Returning Results**](#6-returning-results)
    - [7. **Making Your Command Appear in Help \& Autocomplete**](#7-making-your-command-appear-in-help--autocomplete)
    - [8. **Tips \& Best Practices**](#8-tips--best-practices)
    - [9. **Checklist and Summary**](#9-checklist-and-summary)

---

## Setting up

To set up, download the folder `src/components/console` and include it in your project. Once you've done that, integrate the console into your application as shown below.

```tsx
import { ConsoleLine } from "./components/console/ConsoleLine";

<ConsoleLine commands={commands} style={theme} />
```

For a working example, check out the [demo here](https://moaesaycto.github.io/console).

---

## Adding a Starting Message

You can define a custom starting message to display when the console is loaded. This is useful for showing instructions, welcome text, or system information.

### Example

```tsx
const startMessage: string = `
Welcome to the Custom Console!
Type 'help' to see available commands.

Use 'echo' to repeat messages, 'math' to evaluate expressions, or 'time' to check the current date and time.
`;

<ConsoleLine commands={commands} style={theme} startMessage={startMessage} />
```

- Use `\n` to add line breaks in the starting message.
- Use **color codes** (if supported by your console implementation) to style the message:
  - `&r` for primary color
  - `&s` for secondary color
  - `&w` for warning
  - `&e` for error

---

## Adding Custom Themes

The default theme mimics an old-school console. You can customize the theme by modifying or overriding its properties.

### Example

```tsx
import { ConsoleTheme } from "./components/console/utils/theme";

const partialTheme: ConsoleTheme = {
  fontSize: "16px",
};

<ConsoleLine commands={commands} style={partialTheme} />
```

---

## Custom Commands

This console system supports custom commands that include:

- **Auto-completion**  
- **Help integration**  
- **Nested commands**  
- **Custom parameter parsing**  

### 1. **Understand the `Command` Interface**

Commands must conform to the `Command` interface:

```ts
export interface Command {
  name: string;                  // e.g. "greet"
  description: string;           // Short text describing the command
  subCommands?: Command[];       // Nested commands
  defaults?: Record<string, string>; // Default parameters (optional)
  usage: string;                 // Example usage of the command
  parseParams: (args: string[]) => Record<string, any> | null;  
  run: (args: string[], params: Record<string, any>, context: CommandContext) => { 
    completed: boolean; 
    status: string; 
  };
  autoComplete?: (args: string[]) => string[]; // Custom autofill suggestions (optional)
}
```

---

### 2. **Example of a Simple Command**

```ts
import { Command } from "../types";

export const greetCommand: Command = {
  name: "greet",
  description: "Greets a user by name.",
  usage: "greet <name> [--time=day|night]",
  parseParams: (args) => {
    if (args.length < 1) return null;
    const [name, ...flags] = args;
    const time = flags.find((flag) => flag.startsWith("--time="))?.split("=")[1] || "day";
    return { name, time };
  },
  run: (args, params) => ({
    completed: true,
    status: `Good ${params.time}, ${params.name}!`,
  }),
};
```

Add `greetCommand` to your `allCommands` array, and it will be available in the console.

---

### 3. **Nested Commands (Subcommands)**

Subcommands are nested under a parent command. For example:

```ts
import { Command } from "../types";

const addCommand: Command = { /* ... */ };
const subtractCommand: Command = { /* ... */ };

export const mathCommand: Command = {
  name: "math",
  description: "Perform math operations",
  usage: "math <add|subtract> [args]",
  subCommands: [addCommand, subtractCommand],
};
```

The user can then type commands like `math add 1 2`.

---

### 4. **Ensuring Parameters Are Valid**

In `parseParams`, validate parameters and return `null` if invalid. The console automatically shows an error message.

---

### 5. **Autofill and Suggestions**

#### Custom Autofill

Commands can define custom autofill logic using the `autoComplete` property. For example:

```ts
export const rpsCommand: Command = {
  name: "rps",
  description: "Play Rock-Paper-Scissors",
  usage: "rps <rock|paper|scissors>",
  autoComplete: () => ["rock", "paper", "scissors"],
  parseParams: (args) => (args.length === 1 ? { choice: args[0] } : null),
  run: (args, params) => ({
    completed: true,
    status: `You chose ${params.choice}!`,
  }),
};
```

#### How Autofill Works

- **Top-level commands**: Autofill suggests commands based on the partial input.  
- **Nested commands**: Autofill works recursively within `subCommands`.  
- **Custom suggestions**: Use the `autoComplete` property for dynamic suggestions.  

---

### 6. **Returning Results**

Return `{ completed: boolean, status: string }` in the `run` method to display messages in the console.

---

### 7. **Making Your Command Appear in Help & Autocomplete**

Commands added to the array passed to `<ConsoleLine commands={...} />` are automatically included in:

- The `help` command
- Autofill suggestions

---

### 8. **Tips & Best Practices**

- Keep `parseParams` strict yet flexible.  
- Use `autoComplete` for dynamic suggestions.  
- Leverage `subCommands` for complex commands.  

---

### 9. **Checklist and Summary**

1. **Define the command** with `name`, `description`, `usage`, and logic.  
2. **Add it** to the `commands` array.  
3. Use `autoComplete` and `subCommands` for dynamic behavior.  
4. Test the command via the console UI.  

---

_Like what I do? See more [here](https://moaesaycto.github.io/)!_