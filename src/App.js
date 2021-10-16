import { CssBaseline, ThemeProvider } from "@mui/material";
import {useState} from "react";

import Header from "./Components/Header";
import NFTTable from "./Components/NFTTable";
import * as Theme from "./Theme/index"


function App() {
  const [theme, setTheme] = useState(Theme.dark)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Header setTheme={setTheme.bind(this)} theme={theme} />

      <NFTTable theme={theme} />
    </ThemeProvider>
  );
}

export default App;
