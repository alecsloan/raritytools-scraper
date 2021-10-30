import {CssBaseline, Grid, IconButton, ThemeProvider} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";

import Header from "./Components/Header";
import NFTTable from "./Components/NFTTable";
import NFTGraphDisplayController from "./Components/NFTGraphDisplayController";
import Statistics from "./Components/Statistics";
import * as Theme from "./Theme/index"
import backupNFTs from "./data/VOX.json";
import voxRarity from "./data/VOX-rarity.json";
import {ThumbUp} from "@mui/icons-material";
import {useSnackbar} from "notistack";

function App(props) {
  const minuteCooldown = 10;

  const {enqueueSnackbar} = useSnackbar()

  const [nfts, setNFTs] = useState(JSON.parse(localStorage.getItem("nfts")) || backupNFTs)
  const [theme, setTheme] = useState(Theme.dark)

  const getNFTs = useCallback(async () => {
    enqueueSnackbar(`Trying to update data: ${new Date().toLocaleString('en-US')}`, { variant: 'info' })

    let openseaAPIURLs = []

    for (let offset = 0; offset < 8888; offset += 50) {
      openseaAPIURLs.push(`https://api.opensea.io/api/v1/assets?order_direction=desc&offset=${offset}&limit=50&collection=collectvox`)
    }

    let assets = []

    await Promise.all(openseaAPIURLs.map(url => fetch(url)))
      .then(responses =>
        Promise.all(responses.map(res => res.json()))
      ).then(json => {
        return json.forEach(subData => assets = assets.concat(subData.assets.filter(nft => (nft.sell_orders && nft.sell_orders[0].payment_token === "0x0000000000000000000000000000000000000000"))))
      }).catch(() =>  {
        console.log("Failed to connect to Opensea")
      })

    if (assets.length === 0)
      return

    assets = assets.map((asset) => {
      const id = asset.token_id

      const vox = voxRarity.find(v => v.id === id)
      const price = asset.sell_orders[0].base_price /= Math.pow(10, 18)

      return {
        "id": id,
        "image": asset.image_thumbnail_url,
        "price": price,
        "name": asset.name,
        "opensea": asset.permalink,
        "rank": vox.rank,
        "rarity": vox.rarity,
        "ethPerRarity": price / vox.rarity
      }
    })

    setNFTs(assets)

    localStorage.setItem("dataUpdated", new Date().getTime())
    localStorage.setItem("nfts", JSON.stringify(nfts))

    enqueueSnackbar(`Data Updated: ${new Date().toLocaleString('en-US')}`, { variant: 'success' })
  }, [nfts, enqueueSnackbar])

  useEffect(() => {
    if (!localStorage.getItem("theyUnderstand")) {
      enqueueSnackbar('This is a community project and not affiliated with Gala Games.',
        {
          action: key =>  {
            return <IconButton
              aria-label="got-it"
              color="inherit"
              onClick={() => {
                localStorage.setItem("theyUnderstand", true)
                props.notistackRef.current.closeSnackbar(key)
              }}
              size="small"
            >
              <ThumbUp />
            </IconButton>
          },
          persist: true,
          variant: 'warning'
        }
      )
    }

    const dataUpdated = localStorage.getItem("dataUpdated")

    if (!dataUpdated || ((new Date().getTime() - dataUpdated) / (minuteCooldown * 60000) > minuteCooldown)) {
      getNFTs()
    }
    else {
      enqueueSnackbar(`Data was last updated: ${new Date(Number(dataUpdated)).toLocaleString('en-US')}`, { variant: 'info' })
    }
  }, [enqueueSnackbar, getNFTs, props.notistackRef, setNFTs])

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Header getNFTs={getNFTs.bind(this)} minuteCooldown={minuteCooldown} setTheme={setTheme.bind(this)} theme={theme} />

        <Statistics nfts={nfts} />

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
