# Custom Console
If you like what I do, consider visiting my website [here](https://moaesaycto.github.io/)! I like to make things, and I'm slowly but surely making more things for you to see and use if you want to.

> ### Disclaimer
> This project is provided "as is" without any warranties or guarantees. Use it at your own risk. I'm not responsible for any damage or issues that may arise from using this project. Contributions and feedback are welcome, though I can't promise I'll have the time to change things around. Most of what I do is for simple and fun projects.
 
 # Table of Contents

- [Custom Console](#custom-console)
- [Table of Contents](#table-of-contents)
  - [Setting up](#setting-up)
  - [Adding Custom Themes](#adding-custom-themes)
  - [Custom Commands](#custom-commands)
    - [1. **Understand the `Command` Interface**](#1-understand-the-command-interface)
    - [2. **Example of a Simple Command**](#2-example-of-a-simple-command)
      - [Adding `greetCommand` to Your Console](#adding-greetcommand-to-your-console)
    - [3. **Nested Commands (Subcommands)**](#3-nested-commands-subcommands)
    - [4. **Ensuring Parameters Are Valid**](#4-ensuring-parameters-are-valid)
    - [5. **Returning Results**](#5-returning-results)
    - [6. **Making Your Command Appear in Help \& Autocomplete**](#6-making-your-command-appear-in-help--autocomplete)
    - [7. **Tips \& Best Practices**](#7-tips--best-practices)
    - [8. **Checklist and Summary**](#8-checklist-and-summary)

---


## Setting up
To set up, since I haven't figured out a particularly great way to make it easier, all you have to do is download the folder `src/components/console` and put it in your own project. It should fit together nicely. I may try to make it publicly available via download on NPM, but I am not in the position to learn how to do that as of writing this.

Alright, once you have set it up, consider looking through the rest of the code on how it's used. This repository contains not just the component, but also an implementation of it on a website, which you can [demo here](https://moaesaycto.github.io/console).

In order to set it up with your custom commands, you will need to familiarize yourself with the following.

- When using the component, you simply need to import it and provide a style the commands. 

```ts
  import { ConsoleLine } from "./components/console/ConsoleLine";

  <ConsoleLine commands={commands} style={theme} />
```

## Adding Custom Themes

There is a default theme that mimics an old-timey computer console. You may not like this theme, so it's pretty easy to change it. The default theme structure looks like this:

```tsx
{
  name: "darkMode",
  font: "monospace",
  fontSize: "14px",
  lineHeight: "1.3",
  textColor: {
    primary: "#349E44",
    secondary: "#5D60CB",
    warning: "#E2C541",
    error: "#E0002D",
    default: "#64A8BC",
  },
  backgroundColor: {
    primary: "#171717",
    secondary: "#2F2F2F",
    default: "#212121",
  },
  scrollColor: {
    primary: "#73AD34",
    secondary: "#01A816",
    default: "#115BCA",
  },
};
  ```

  When changing the theme, simply write out the changes you want to implement, and pass them into the component, like so:

  ```tsx
import { ConsoleTheme } from "./components/console/utils/theme";

const partialTheme: ConsoleTheme = { 
    fontSize: "16px",
};

<ConsoleLine commands={commands} style={partialTheme} />
```

I'm not entirely sure if all the options work when you try to change them, but they seem to.

## Custom Commands
The [demo here](https://moaesaycto.github.io/console) provides three commands. Two of them are built in already and cannot be removed unless you _REALLY_ don't want them included. If you want to get rid of these functions, go into `src/components/console/commands/commands.ts` and change it to:

```ts
import { Command } from "../types";

export const builtInCommands: Command[] = [];
```

Now, if you want to implement your own functions and commands, you can see how it was done if you navigate over to `src/commands/helloCommand.ts`. For a more indepth understanding, please keep reading.

-----

This console system allows you to define **custom commands** that integrate with the console’s:

- **Auto-completion**  
- **Help command**  
- **Command hierarchy** (subcommands, parameters)  
- **Parameter parsing**  

By following a few steps, you can create new commands (or subcommands) and have them automatically recognized.

---

### 1. **Understand the `Command` Interface**

A **Command** has the following shape (TypeScript notation):
```ts
export interface Command {
  name: string;                  // e.g. "greet"
  description: string;           // Short text describing the command
  subCommands?: Command[];       // Nested commands, if needed
  defaults?: Record<string, string>;
  usage: string;                 // e.g. "greet <name> [--time=day|night]"
  
  // Converts the raw arguments array (e.g. ["Alice", "--time=night"]) into a
  // structured object or null if invalid:
  parseParams: (args: string[]) => Record<string, any> | null;  
  
  // Executes the command. You can do anything here, like return a status message,
  // update application state, etc. The `context` gives you access to the console's
  // `allCommands` and `setHistory`.
  run: (
    args: string[],
    params: Record<string, any>,
    context: CommandContext
  ) => { completed: boolean; status: string };
}
```

> - **`name`** is the exact string users must type to invoke this command.  
> - **`description`** appears in the help listing.  
> - **`usage`** is displayed if the user requests help or uses the command incorrectly.  
> - **`subCommands`** is optional. If you have nested commands, you can list them here.  
> - **`parseParams`** should **return `null`** if the user’s arguments are **invalid**. That signals to the console to show a usage error.  
> - **`run`** should return an object: 
>   - `completed`: `true` if the command ran successfully, `false` if it failed.  
>   - `status`: A string that is displayed in the console output.  

---

### 2. **Example of a Simple Command**

Here’s a minimal command named `"greet"` that:

1. Requires the user to provide at least one argument (the name).  
2. Optionally accepts a `--time=` parameter.  
3. Returns a status message like `"Good day, Alice!"`.

```ts
import { Command, CommandContext } from "../types";

export const greetCommand: Command = {
  name: "greet",
  description: "Greets a user by name.",
  usage: "greet <name> [--time=day|night]",
  
  // Convert raw args to an object
  parseParams: (args) => {
    if (args.length < 1) return null;
    
    const [nameOrFirstArg, ...flags] = args;
    if (!nameOrFirstArg) return null;

    let time = "day"; // default
    flags.forEach((flag) => {
      if (flag.startsWith("--time=")) {
        time = flag.split("=")[1];
      }
    });

    return { name: nameOrFirstArg, time };
  },
  
  // Run the command
  run: (args, params, context: CommandContext) => {
    const { name, time } = params;
    // Return a string that the console displays
    return {
      completed: true,
      status: `Good ${time}, ${name}!`,
    };
  },
};
```

#### Adding `greetCommand` to Your Console

1. **Export** it in a file like `greetCommand.ts`.  
2. **Import** it into your aggregator or command-list file (e.g., `index.ts` or wherever you define `allCommands`).  
3. **Push** it into the array of commands.

```ts
// /src/commands/index.ts
import { helpCommand, clearCommand } from "./builtInCommands";
import { greetCommand } from "./greetCommand";
export const allCommands = [
  helpCommand,
  clearCommand,
  greetCommand, // Add your custom command here!
];
```

**Result**:  
- Typing `help` will list “greet” as one of the commands.  
- Typing `greet Alice` will output `Good day, Alice!` (default time).  
- Typing `greet Bob --time=night` will output `Good night, Bob!`.

---

### 3. **Nested Commands (Subcommands)**

If you want to nest subcommands, set **`subCommands`** on your root command.  
For example, a `"math"` command with subcommands `"add"` and `"subtract"`:

```ts
import { Command, CommandContext } from "../types";

const addCommand: Command = {
  name: "add",
  description: "Adds two numbers",
  usage: "math add <num1> <num2>",
  parseParams: (args) => {
    if (args.length < 2) return null;
    const [a, b] = args;
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (isNaN(numA) || isNaN(numB)) return null;
    return { a: numA, b: numB };
  },
  run: (args, params, context) => {
    const sum = params.a + params.b;
    return {
      completed: true,
      status: `Result: ${sum}`,
    };
  },
};

const subtractCommand: Command = {
  name: "subtract",
  description: "Subtracts two numbers",
  usage: "math subtract <num1> <num2>",
  parseParams: (args) => {
    if (args.length < 2) return null;
    const [a, b] = args;
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (isNaN(numA) || isNaN(numB)) return null;
    return { a: numA, b: numB };
  },
  run: (args, params, context) => {
    const diff = params.a - params.b;
    return {
      completed: true,
      status: `Result: ${diff}`,
    };
  },
};

export const mathCommand: Command = {
  name: "math",
  description: "Math operations",
  usage: "math <subCommand> [args]",
  // If user types just "math"
  parseParams: (args) => {
    // no specific parse for top-level "math"
    return {};
  },
  run: (args, params, context) => {
    if (!args.length) {
      return {
        completed: false,
        status: "You typed 'math' without a subcommand. Usage: math <add|subtract> ...",
      };
    }
    // If user typed an unknown subcommand
    return {
      completed: false,
      status: `Unknown subcommand: ${args[0]}`,
    };
  },
  subCommands: [addCommand, subtractCommand],
};
```

Then add `mathCommand` to your `allCommands`. The user can type:

- `math add 2 3` => “Result: 5”  
- `math subtract 5 2` => “Result: 3”  
- `help math` => sees usage, subcommands.

---

### 4. **Ensuring Parameters Are Valid**

In **`parseParams`**, you decide how to parse and validate. If the user’s input is invalid, **return `null`**. The console will automatically show a usage error, e.g.:

```
Invalid parameters. Usage: math add <num1> <num2>
```

Examples of “invalid”:

- Missing arguments  
- Malformed flags  
- Non-numeric input where a number is expected  

---

### 5. **Returning Results**

In **`run(args, params, context)`**, you can:

- Manipulate **`context.setHistory`** if you want to insert extra lines into the console.  
- Access **`context.allCommands`** if you need to query other commands (like for a custom help system).  
- Return `{ completed: true, status: "some message" }` to show a success.  
- Or `completed: false` if there was a problem.  

The console always logs the `status` in its output area.

---

### 6. **Making Your Command Appear in Help & Autocomplete**

When you **add** your custom command to the array that’s passed to `<ConsoleLine commands={allCommands} />`, it will:

1. **Appear in `help`** listings (top-level or subcommand listings).  
2. **Auto-complete** when the user types partial command names.

**Example** usage in your top-level aggregator:

```ts
// /src/commands/index.ts
import { helpCommand, clearCommand } from "./builtInCommands";
import { greetCommand } from "./greetCommand";
import { mathCommand } from "./mathCommand";

export const allCommands = [
  helpCommand,
  clearCommand,
  greetCommand,
  mathCommand,
];
```

Then in **`App.tsx`** (or wherever your console is used):

```tsx
<ConsoleLine commands={allCommands} />
```

---

### 7. **Tips & Best Practices**

1. **Keep your `parseParams` strict yet flexible**:  
   - Return `null` for incorrect usage so the console can prompt the user.  
   - Provide helpful usage messages if possible.

2. **Use subcommands**:  
   - If your command does multiple distinct things, **subcommands** keep them organized.

3. **Description & Usage**:  
   - Fill these out meaningfully so the built-in `help` command can guide users.

4. **Remember you can do anything in `run`**:  
   - Log extra lines with `context.setHistory(prev => [...prev, "Extra info"])`.  
   - Possibly trigger side effects in your application.  
   - Return helpful status messages.

---

### 8. **Checklist and Summary**

To summarize:

1. Create a **TypeScript file** exporting a `Command` object.  
2. **Implement** `parseParams` and `run`.  
3. **Add** your command to the `allCommands` array.  
4. **Pass** `allCommands` into `<ConsoleLine commands={allCommands} />`.  

