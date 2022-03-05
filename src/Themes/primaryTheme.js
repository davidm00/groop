import { createTheme } from "@mui/material/styles";

// Colors
// Black - #0b1312
// Dark turquoise - #0c3b39
// Salmon pink - #c28e92 (secondary)
// Light wheat - #d5c1ae (primary)
// Off white - #f0f1eb

// Light and dark create using material ui palatte generator

export const primaryTheme = createTheme({
  palette: {
    primary: {
      light: "#fff4e0",
      main: "#d5c1ae",
      dark: "#a3917f",
      contrastText: "#000",
    },
    secondary: {
      light: "#65919f",
      main: "#376371",
      dark: "#033946",
      contrastText: "#000",
    },
    text: {
      primary: "#0b1312",
      secondary: "#f0f1eb",
      disabled: "#e2e2e2",
    },
    background: {
      default: "#cac6a8",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#033946",
          color: "white"
        },
      },
    },
  },
});
