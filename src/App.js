//0.1.0
//0.1.1
import React from "react";
import * as Env from "./environment";
import Parse from "parse";
import RoutesView from "./Components/RoutesView";
// import { ThemeProvider as MuiThemeProvider } from "@mui/styles";
// import { ThemeProvider } from "@emotion/react";
// import CssBaseline from "@mui/material/CssBaseline";

// import { primaryTheme } from "./Themes/primaryTheme";
import EmotionTheme from "./Common/EmotionTheme";

Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;

function App() {
  return (
    // <MuiThemeProvider theme={primaryTheme}>
    //   <ThemeProvider theme={primaryTheme}>
    //     {/* <CssBaseline /> */}
    //     <div className="App">
    //       <RoutesView />
    //     </div>
    //   </ThemeProvider>
    // </MuiThemeProvider>
    <EmotionTheme>
      <div className="App">
        <RoutesView />
      </div>
    </EmotionTheme>
  );
}

export default App;
