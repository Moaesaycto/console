import { ConsoleLine } from "./components/console/ConsoleLine";
import { ConsoleTheme, mergeTheme } from "./components/console/utils/theme";

import Header from "./components/Header";
import Footer from "./components/Footer";

import { helloCommand } from "./commands/helloCommand";
import { mathCommand } from "./commands/mathCommand";
import { rollCommand } from "./commands/rollCommand";
import { randomCommand } from "./commands/randomCommand";
import { echoCommand } from "./commands/echoCommand";
import { jokeCommand } from "./commands/jokeCommand";
import { timeCommand } from "./commands/timeCommand";
import { rpsCommand } from "./commands/rockPaperScissorsCommand";
import { headsOrTailsCommand } from "./commands/headsOrTailsCommand";
import { buildComputerCommand } from "./commands/buildComputer";

import { themes } from "./themes/presets";
import { useState } from "react";
import ThemeSelector from "./themes/ThemeSelector";

import { PlayIcon } from "@radix-ui/react-icons";

/* This is an example of updating the theme with a custom font size. Normally it's 14px, but for
this demonstration, it has been changed to 16px */
const partialTheme: ConsoleTheme = {
  fontSize: "16px",
};

void partialTheme;

const startMessage: string = `Initiating session...
Console loaded successfully!
&wNote: This console is just a demonstration. You will be able to implement your own custom commands when implemented yourself. Learn more at github.com/Moaesaycto/console.\n
&s---===[ &rMOAE&s ]===---&r
Welcome to the Custom Console Demo by MOAE!
Type 'help' to see the available commands.
`

const commands = [
  helloCommand,
  mathCommand,
  rollCommand,
  randomCommand,
  echoCommand,
  jokeCommand,
  timeCommand,
  rpsCommand,
  headsOrTailsCommand,
  buildComputerCommand,
];

const commandDescriptions = [
  ["buildcomputer", "Build a custom computer by selecting components step-by-step."],
  ["clear", "Clears the console output."],
  ["coinflip", "Flips a coin and returns 'Heads' or 'Tails'."],
  ["echo", "Repeats back the provided input."],
  ["hello", "Root command for greetings."],
  ["help", "Displays help information about commands."],
  ["joke", "Tells a random joke."],
  ["math", "Evaluates a mathematical expression."],
  ["random", "Generates a random number between <min> and <max>."],
  ["roll", "Rolls dice. Specify the number of sides and rolls."],
  ["rps", "Play Rock, Paper, Scissors against the console."],
  ["time", "Displays the current date and time."],
];

const colorCodes = [
  ["&r", "Return to primary color"],
  ["&s", "Secondary color"],
  ["&w", "Warning color"],
  ["&e", "Error color"]
]

function App() {
  const [currentTheme, setCurrentTheme] = useState<string>("darkMode");

  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "Barlow, sans-serif",
        backgroundColor: "#242424",
      }}
    >
      <Header />
      <div style={{ flex: "1", paddingTop: "60px", maxWidth: "1280px", alignSelf: "center" }}>
        <p
          style={{
            width: "80%",
            color: "#fff",
            textAlign: "center",
            margin: "0 auto",
            fontFamily: "Barlow, sans-serif",
            fontSize: "18px",
            lineHeight: "1.6",
          }}
        >
          This console is a basic implementation of the component available{" "}
          <a
            href="https://github.com/Moaesaycto/console/"
            style={{
              color: "#00aaff",
              textDecoration: "none",
              fontWeight: "bold",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.textDecoration = "underline")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.textDecoration = "none")
            }
          >
            here
          </a>
          . There, you should be able to find a tutorial on how to implement your own functions and styles to it, along with the basic implementation you see here on
          this site! Type <code style={codeStyle}>help</code> below to learn about each command.
        </p>
        <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
          <ThemeSelector currentTheme={currentTheme} themes={themes} onThemeChange={handleThemeChange} />
        </div>
        <div
          style={{
            width: "80%",
            height: "600px",
            margin: "20px auto",
            backgroundColor: "#222",
            border: "1px solid #ccc",
          }}
        >

          {/* ACTUAL IMPLEMENTATION HERE */}
          <ConsoleLine
            commands={commands}
            style={mergeTheme(themes[currentTheme])}
            startMessage={startMessage}
            placeholderText="Enter a command here"
            runButton={
              <PlayIcon style={{ width: "20px", height: "20px", color: "currentColor" }} />
            }
          />

        </div>
        <br />
        <div style={{ width: "80%", margin: "20px auto", color: "#fff" }}>
          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
            Available Commands
          </h3>
          <p>
            To learn more about each command, use the <code style={codeStyle}>help</code> command in the console above. For example, type <code style={codeStyle}>help hello</code> to
            see the usage of the <code style={codeStyle}>hello</code> command
          </p>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Command</th>
                <th style={tableHeaderStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {commandDescriptions.map(([cmd, desc], idx) => (
                <tr key={idx}>
                  <td style={tableCellStyle}>
                    <code style={codeStyle}>{cmd}</code>
                  </td>
                  <td style={tableCellStyle}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br />
        <div style={{ width: "80%", margin: "20px auto", color: "#fff" }}>
          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
            Color Codes
          </h3>
          <p>
            Color codes are used to change the preceeding text to a certain color. For example, if you were to type <code style={codeStyle}>&eHello&r, World!</code>, the
            word <code style={codeSecondaryStyle}>Hello</code> will be in the error color, while the <code style={codeSecondaryStyle}>, World!</code> part of the string is
            returned to the primary color.
          </p>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Code</th>
                <th style={tableHeaderStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {colorCodes.map(([code, desc], idx) => (
                <tr key={idx}>
                  <td style={tableCellStyle}>
                    <code style={codeStyle}>{code}</code>
                  </td>
                  <td style={tableCellStyle}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            You can try this out yourself in the console above by using these codes with the <code style={codeStyle}>echo</code> command. For example, type
            out <code style={codeStyle}>echo &eHello&r, World!</code> to see it in action. These are automatically formatted by
          </p>
        </div>
      </div>
      <br />
      <Footer />
    </div>
  );
}

const codeStyle: React.CSSProperties = {
  backgroundColor: "#333",
  color: "#00ffcc",
  padding: "2px 6px",
  borderRadius: "4px",
  fontFamily: "monospace",
};

const codeSecondaryStyle: React.CSSProperties = {
  backgroundColor: "#333",
  color: "#a782ff",
  padding: "2px 6px",
  borderRadius: "4px",
  fontFamily: "monospace",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
};

const tableHeaderStyle: React.CSSProperties = {
  backgroundColor: "#444",
  color: "#fff",
  padding: "10px",
  textAlign: "left",
  borderBottom: "2px solid #666",
};

const tableCellStyle: React.CSSProperties = {
  padding: "10px",
  borderBottom: "1px solid #666",
};

export default App;
