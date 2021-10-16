import { colors, createTheme } from "@mui/material";

export const dark = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#212121',
      paper: colors.grey[800]
    },
    primary: {
      main: colors.grey[900]
    },
    secondary: {
      main: colors.red[300]
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