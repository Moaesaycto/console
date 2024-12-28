import { ConsoleLine } from "./components/console/ConsoleLine";
import { ConsoleTheme } from "./components/console/utils/theme";
import { helloCommand } from "./commands/helloCommand";
import Header from "./components/Header";
import Footer from "./components/Footer";

/* This is an example of updating the theme with a custom font size. Normally it's 14px, but for
this demonstration, it has been changed to 16px */
const partialTheme: ConsoleTheme = {
  fontSize: "16px",
};

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "Barlow, sans-serif" }}>
      <Header />
      <div style={{ flex: "1", paddingTop: "60px" }}>
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
            style={{ color: "#00aaff", textDecoration: "none" }}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            here
          </a>
          . There, you should be able to find a tutorial on how to implement your own functions to it, along with the basic
          implementation you see here on this site!
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
      <Footer />
    </div>
  );
}

export default App;
