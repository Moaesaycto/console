import { ConsoleLine } from "./components/console/ConsoleLine";
import { ConsoleTheme } from "./components/console/utils/theme";

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

/* This is an example of updating the theme with a custom font size. Normally it's 14px, but for
this demonstration, it has been changed to 16px */
const partialTheme: ConsoleTheme = {
  fontSize: "16px",
};

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

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "Barlow, sans-serif",
      }}
    >
      <Header />
      <div style={{ flex: "1", paddingTop: "60px", maxWidth: "1280px", alignSelf: "center"}}>
        <p
          style={{
            width: "80%",
            color: "#fff",
            textAlign: "center",
            margin: "0 auto",
            fontFamily: "Barlow, sans-serif",
            fontSize: "18px", // Adjust font size as needed
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
          . There, you should be able to find a tutorial on how to implement
          your own functions to it, along with the basic implementation you see
          here on this site! Type <code style={codeStyle}>help</code> below to
          learn about each command.
        </p>
        <div
          style={{
            width: "80%",
            height: "600px",
            margin: "20px auto",
            backgroundColor: "#222",
          }}
        >
          <ConsoleLine commands={commands} style={partialTheme} />
        </div>
        <br />
        <div style={{ width: "80%", margin: "20px auto", color: "#fff" }}>
          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
            Available Commands
          </h3>
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
      </div>
      <br />
      <Footer />
    </div>
  );
}

/* Styles */
const codeStyle: React.CSSProperties = {
  backgroundColor: "#333",
  color: "#00ffcc",
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
