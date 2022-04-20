import { createTheme } from "@mui/material/styles";

// Colors
// Primary Colors
const pLight = "#fff4e0";
const pMain = "#d5c1ae";
const pDark = "#a3917f";
const pContrast = "#000";

// Secondary Colors
const sLight = "#65919f";
const sMain = "#376371";
const sDark = "#033946";
const sContrast = "#000";

// Utility
/* Text */
const tPrimary = "#0b1312";
const tSecondary = "#f0f1eb";
const tDisabled = "#e2e2e2";
/* Background */
const background = "#cac6a8";
/* Delete */
const deleteMain = "#d9383e";
const deleteHover = "#c3342c";

// Light and dark create using material ui palatte generator

export const primaryTheme = createTheme({
  palette: {
    primary: {
      light: pLight,
      main: pMain,
      dark: pDark,
      contrastText: pContrast,
    },
    secondary: {
      light: sLight,
      main: sMain,
      dark: sDark,
      contrastText: sContrast,
    },
    text: {
      primary: tPrimary,
      secondary: tSecondary,
      disabled: tDisabled,
    },
    background: {
      default: background,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: sDark,
          color: "white",
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: {variant: "standard"},
          style: {
            backgroundColor: pDark,
            color: "white",
            "&:hover": {
              backgroundColor: pMain,
              boxShadow: " 0 8px 16px 0 rgba(0, 0, 0, 0.2)",
            }
          }
        },
        {
          props: {variant: "submit"},
          style: {
            backgroundColor: sDark,
            color: "white",
            "&:hover": {
              backgroundColor: sMain,
              boxShadow: " 0 8px 16px 0 rgba(0, 0, 0, 0.2)",
            }
          }
        },
        {
          props: {variant: "delete"},
          style: {
            backgroundColor: deleteMain,
            color: "white",
            "&:hover": {
              backgroundColor: deleteHover,
              boxShadow: " 0 8px 16px 0 rgba(0, 0, 0, 0.2)",
            }
          }
        }
      ],
    },
  },
});
