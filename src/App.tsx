import { ConsoleLine } from "./components/console/ConsoleLine";
import { ConsoleTheme } from "./components/console/utils/theme";
import { helloCommand } from "./commands/helloCommand";

const partialTheme: ConsoleTheme = {
  fontSize: "16px",
};

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignContent: "center", width: "100vw"}}>
      <h1 style={{ color: "#fff", textAlign: "center"}}>Custom Console Demo</h1>
      <p style={{ width: "80%", color: "#fff", textAlign: "center"}}>
        This console is a basic implementation of the component available here:
      </p>
      <div
        style={{
          width: "80%",
          height: "600px",
          margin: "20px auto",
          backgroundColor: "#222",
        }}
      >
        <ConsoleLine commands={[helloCommand]} style={partialTheme} />
      </div>
    </div>
  );
}

export default App;
