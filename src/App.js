import {CssBaseline, Grid, ThemeProvider} from "@mui/material";
import {useState} from "react";

import Header from "./Components/Header";
import NFTTable from "./Components/NFTTable";
import NFTGraphDisplayController from "./Components/NFTGraphDisplayController";
import * as Theme from "./Theme/index"
import nfts from "./data/VOX.json";


function App() {
  const [theme, setTheme] = useState(Theme.dark)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Header setTheme={setTheme.bind(this)} theme={theme} />

      <Grid container>
        <Grid item lg={1} sm={0} />
        <Grid item lg={10} sm={12}>
          <NFTGraphDisplayController nfts={nfts} />
        </Grid>
      </Grid>

      <NFTTable nfts={nfts} theme={theme} />
    </ThemeProvider>
  );
}

export default App;
