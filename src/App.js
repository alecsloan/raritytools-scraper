import { CssBaseline, ThemeProvider } from "@mui/material";
import {useState} from "react";

import Header from "./Components/Header";
import NFTTable from "./Components/NFTTable";
import * as Theme from "./Theme/index"
import NFTPriceScatterPlot from "./Components/NFTPriceScatterPlot";
import nfts from "./data/VOX.json";


function App() {
  const [theme, setTheme] = useState(Theme.dark)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Header setTheme={setTheme.bind(this)} theme={theme} />

      <NFTPriceScatterPlot nfts={nfts} />

      <NFTTable nfts={nfts} theme={theme} />
    </ThemeProvider>
  );
}

export default App;
