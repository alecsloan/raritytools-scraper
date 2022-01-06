import {Box, CssBaseline, IconButton, Tab, Tabs, ThemeProvider} from "@mui/material";
import React, {useCallback, useEffect, useMemo, useState} from "react";

import Header from "./Components/Header";
import NFTTable from "./Components/NFTTable";
import NFTGraphDisplayController from "./Components/NFTGraphDisplayController";
import Statistics from "./Components/Statistics";
import * as Theme from "./Theme/index"
import backupNFTs from "./data/VOX.json";
import townStarVOXRarity from "./data/VOX-rarity.json";
import mirandusVOXRarity from "./data/Mirandus-VOX-rarity.json";
import {ThumbUp} from "@mui/icons-material";
import {useSnackbar} from "notistack";
import {TabContext, TabPanel} from "@mui/lab";
import MyVOX from "./Components/MyVOX";
import NFTTableMobile from "./Components/NFTTableMobile";

function App(props) {
  const minuteCooldown = 10;

  const {enqueueSnackbar} = useSnackbar()

  const [account, setAccount] = useState(null)
  const [nftTable, setNFTTable] = useState('townStar')
  const [townStarVOX, setTownStarVOX] = useState(JSON.parse(localStorage.getItem("townStarVOX")) || backupNFTs)
  const [townStarLow, setTownStarLow] = useState(localStorage.getItem("townStarLow") || 0)
  const [townStarMedian, setTownStarMedian] = useState(localStorage.getItem("townStarMedian") || 0)
  const [mirandusVOX, setMirandusVOX] = useState(JSON.parse(localStorage.getItem("mirandusVOX")) || [])
  const [mirandusLow, setMirandusLow] = useState(localStorage.getItem("mirandusLow") || 0)
  const [mirandusMedian, setMirandusMedian] = useState(localStorage.getItem("mirandusMedian") || 0)
  const [theme, setTheme] = useState(Theme.dark)

  const relative = useMemo(() => {
    return new Intl.RelativeTimeFormat('en', { localeMatcher: "best fit", numeric: "always", style: 'long' });
  }, [])

  const getNFTHelper = useCallback(async (openseaAPIURLs) => {
    let assets = []

    await Promise.all(openseaAPIURLs.map(url => fetch(url)))
        .then(responses =>
            Promise.all(responses.map(res => res.json()))
        ).then(json => {
          return json.forEach(subData => assets = assets.concat(subData.assets.filter(nft => (nft.sell_orders && nft.sell_orders[0].payment_token === "0x0000000000000000000000000000000000000000"))))
        }).catch(() =>  {
          console.log("Failed to connect to Opensea")

          enqueueSnackbar(`Opensea rejected your request to update listing data. Try again in a minute.`, { variant: 'error' })
        })

    if (assets.length === 0)
      return

    return assets.map((asset) => {
      const id = asset.token_id

      const voxRarity = openseaAPIURLs[0].includes('collectvoxmirandus') ? mirandusVOXRarity : townStarVOXRarity

      const vox = voxRarity.find(v => v.id === id)
      const price = asset.sell_orders[0].base_price /= Math.pow(10, 18)

      if (vox) {
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
      }

      return null
    })
  }, [enqueueSnackbar])

  const getNFTs = useCallback(async (table = nftTable) => {
    if (window.location.href.includes("mirandus-vox") && table === "mirandus") {
      let mirandusOpenseaAPIURLs = []

      for (let offset = 0; offset < 5789; offset += 50) {
        mirandusOpenseaAPIURLs.push(`https://api.opensea.io/api/v1/assets?order_direction=desc&offset=${offset}&limit=50&collection=collectvoxmirandus`)
      }

      let mirandusAssets = await getNFTHelper(mirandusOpenseaAPIURLs)

      if (mirandusAssets) {
        mirandusAssets = mirandusAssets.filter(v => v)
        setMirandusVOX(mirandusAssets)
        localStorage.setItem("mirandusVOX", JSON.stringify(mirandusAssets))
        localStorage.setItem("mirandusDataUpdated", new Date().getTime())
        enqueueSnackbar(`Mirandus VOX Updated: ${new Date().toLocaleString('en-US')}`, { variant: 'success' })

        const rarityPerEthValues = mirandusAssets.map(nft => nft.price / nft.rarity)

        const rarityPerEthSortedValues = rarityPerEthValues.sort()

        const low = rarityPerEthSortedValues[0]

        setMirandusLow(low)
        localStorage.setItem("mirandusLow", low)

        const middle = Math.ceil(rarityPerEthSortedValues.length / 2)

        const median = rarityPerEthSortedValues.length % 2 === 0
            ? (rarityPerEthSortedValues[middle] + rarityPerEthSortedValues[middle - 1]) / 2
            : rarityPerEthSortedValues[middle - 1]

        setMirandusMedian(median)
        localStorage.setItem("mirandusMedian", median)
      }
    }
    else {
      let townStarOpenseaAPIURLs = []

      for (let offset = 0; offset < 8888; offset += 50) {
        townStarOpenseaAPIURLs.push(`https://api.opensea.io/api/v1/assets?order_direction=desc&offset=${offset}&limit=50&collection=collectvox`)
      }

      let townStarAssets = await getNFTHelper(townStarOpenseaAPIURLs)

      if (townStarAssets) {
        setTownStarVOX(townStarAssets)
        localStorage.setItem("townStarVOX", JSON.stringify(townStarAssets))
        localStorage.setItem("dataUpdated", new Date().getTime())
        enqueueSnackbar(`Town Star VOX Updated: ${new Date().toLocaleString('en-US')}`, { variant: 'success' })

        const rarityPerEthValues = townStarAssets.map(nft => nft.price / nft.rarity)

        const rarityPerEthSortedValues = rarityPerEthValues.sort()

        const low = rarityPerEthSortedValues[0]

        setTownStarLow(low)
        localStorage.setItem("townStarLow", low)

        const middle = Math.ceil(rarityPerEthSortedValues.length / 2)

        const median = rarityPerEthSortedValues.length % 2 === 0
            ? (rarityPerEthSortedValues[middle] + rarityPerEthSortedValues[middle - 1]) / 2
            : rarityPerEthSortedValues[middle - 1]

        setTownStarMedian(median)
        localStorage.setItem("townStarMedian", median)
      }
    }
  }, [enqueueSnackbar, getNFTHelper, nftTable, setNFTTable])

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

    if (!dataUpdated || ((new Date().getTime() - dataUpdated) / (minuteCooldown * 60000) * 100) >= 100) {
      getNFTs()
    }
    else if (nftTable === 'townStar') {
      enqueueSnackbar(`Town Star VOX data was last updated about ${relative.format(Math.ceil(-1 * ((new Date().getTime() - dataUpdated) / 60000)), "minute")}`, { variant: 'info' })
    }
  }, [enqueueSnackbar, getNFTs, mirandusVOX, nftTable, props.notistackRef, relative, setMirandusVOX, setTownStarVOX])

  const handleNFTTableChange = async (event, newValue) => {
    await setNFTTable(newValue)

    if (newValue === 'mirandus') {
      const mirandusDataUpdated = localStorage.getItem("mirandusDataUpdated")

      if (window.location.href.includes("mirandus-vox") && (!mirandusDataUpdated || ((new Date().getTime() - mirandusDataUpdated) / (minuteCooldown * 60000) * 100) >= 100)) {
        getNFTs('mirandus')
      }
      else {
        enqueueSnackbar(`Mirandus VOX data was last updated about ${relative.format(Math.ceil(-1 * ((new Date().getTime() - mirandusDataUpdated) / 60000)), "minute")}`, { variant: 'info' })
      }
    }
  }

  let low = nftTable === 'mirandus' ? mirandusLow : townStarLow
  let median = nftTable === 'mirandus' ? mirandusMedian : townStarMedian

  if (nftTable === 'mine') {
    low = null
    median = null
  }

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Header getNFTs={getNFTs.bind(this)} minuteCooldown={minuteCooldown} setTheme={setTheme.bind(this)} table={nftTable} theme={theme} />

        <Statistics low={low} median={median} />

        {window.innerWidth > 480 ? <NFTGraphDisplayController nfts={nftTable === 'townStar' ? townStarVOX : mirandusVOX} table={nftTable} /> : null}

        <Box sx={{ margin: "auto", maxWidth: '1300px', width: '90%' }}>
          <TabContext value={nftTable}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs indicatorColor="secondary" onChange={handleNFTTableChange} value={nftTable} >
                <Tab label="Town Star" value="townStar" />
                { window.location.href.includes("mirandus-vox") ? <Tab label="Mirandus" value="mirandus" /> : null}
                <Tab label="My VOX" value="mine" />
              </Tabs>
            </Box>
            <TabPanel value="townStar">
              {window.innerWidth > 480 ? <NFTTable nfts={townStarVOX} theme={theme} /> : <NFTTableMobile nfts={townStarVOX} theme={theme} />}
            </TabPanel>
            {
              window.location.href.includes("mirandus-vox")
                ? <TabPanel value="mirandus">
                  {window.innerWidth > 480 ? <NFTTable isMirandus={true} nfts={mirandusVOX} theme={theme}/> :
                      <NFTTableMobile nfts={mirandusVOX} theme={theme}/>}
                </TabPanel>
              : null
            }
            <TabPanel value="mine">
              <MyVOX account={account} mirandusLow={mirandusLow} mirandusMedian={mirandusMedian} setAccount={setAccount.bind(this)} townStarLow={townStarLow} townStarMedian={townStarMedian} />
            </TabPanel>
          </TabContext>
        </Box>

    </ThemeProvider>
  );
}

export default App;
