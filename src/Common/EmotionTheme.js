import React from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/styles";
import { ThemeProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";

import { primaryTheme } from "../Themes/primaryTheme";

export default function EmotionTheme({ children }) {
    // console.log("Theme: ", primaryTheme);
    return (
      <MuiThemeProvider theme={primaryTheme}>
        <ThemeProvider theme={primaryTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </MuiThemeProvider>
    );
  }