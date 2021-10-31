import { colors, createTheme } from "@mui/material";

export const dark = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#141722',
      paper: colors.grey[800]
    },
    primary: {
      main: '#2d365c',
    },
    secondary: {
      main: '#6f7acd',
    }
  }
})

export const light = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.grey[900]
    },
    secondary: {
      main: colors.red[300]
    }
  }
})