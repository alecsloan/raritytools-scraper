import {Box, CssBaseline, IconButton, Tab, Tabs, ThemeProvider} from "@mui/material";
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
import SoldNFTTable from "./Components/SoldNFTTable";
import {TabContext, TabPanel} from "@mui/lab";
import MyVOX from "./Components/MyVOX";

function App(props) {
  const minuteCooldown = 10;

  const {enqueueSnackbar} = useSnackbar()

  const [account, setAccount] = useState(null)
  const [nftTable, setNFTTable] = useState('active')
  const [nfts, setNFTs] = useState(JSON.parse(localStorage.getItem("nfts")) || backupNFTs)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [soldNFTs, setSoldNFTs] = useState([])
  const [shouldUpdateSoldNFTs, setShouldUpdateSoldNFTs] = useState(false)
  const [theme, setTheme] = useState(Theme.dark)

  function createSoldNFT(buyer, date, ethPerRarity, id, image, name, opensea, price, rank, rarity, symbol) {
    return { buyer, date, ethPerRarity, id, image, name, opensea, price, rank, rarity, symbol };
  }

  const getNFTs = useCallback(async () => {
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

        enqueueSnackbar(`Couldn't Get Active Listings From Opensea. Using Fallback Data.`, { variant: 'error' })
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

  const getSoldNFTs = useCallback(async () => {
    let offset = page * pageSize

    if (offset > 10000) {
      offset = 10000
    }

    fetch(`https://api.opensea.io/api/v1/events?collection_slug=collectvox&event_type=successful&only_opensea=false&offset=${offset}&limit=${pageSize}`)
      .then((res) => {
        return res.json()
      })
      .then((json) => {
        const events = json.asset_events

        if (events.length === 0)
          return

        setSoldNFTs(
          events.map((nft) => {
            const id = nft.asset.token_id

            const vox = voxRarity.find(v => v.id === id)
            const price = nft.total_price /= Math.pow(10, nft.payment_token.decimals)
            const buyer = nft.winner_account.user ? nft.winner_account.user.username : nft.winner_account.address;

            return (
              createSoldNFT(
                buyer,
                new Date(nft.transaction.timestamp).toLocaleString('en-US', { month: "short", day: "numeric", hour: "numeric", minute: "numeric"}),
                ['ETH', 'WETH'].includes(nft.payment_token.symbol) ? (price / vox.rarity) : null,
                id,
                nft.asset.image_url,
                nft.asset.name,
                nft.asset.permalink,
                price,
                vox.rank,
                vox.rarity,
                nft.payment_token.symbol
              )
            )
          })
        )
    }).catch(() =>  {
      console.log("Failed to connect to Opensea")

      enqueueSnackbar(`Couldn't Get Sold NFTs From Opensea`, { variant: 'error' })
    })
  }, [enqueueSnackbar, setSoldNFTs, page, pageSize])

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
    else if (nftTable === 'active') {
      enqueueSnackbar(`Data was last updated: ${new Date(Number(dataUpdated)).toLocaleString('en-US')}`, { variant: 'info' })
    }

    if (shouldUpdateSoldNFTs) {
      getSoldNFTs()
      setShouldUpdateSoldNFTs(false)
    }
  }, [enqueueSnackbar, getNFTs, getSoldNFTs, nftTable, props.notistackRef, setNFTs, shouldUpdateSoldNFTs])

  const handleSoldNFTPageSizeChange = (newValue) => {
    setPageSize(newValue)
    setShouldUpdateSoldNFTs(true)
  }

  const handleNFTTableChange = (event, newValue) => {
    if (newValue === 'sold') {
      getSoldNFTs()
    }

    setNFTTable(newValue)
  }

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Header getNFTs={getNFTs.bind(this)} minuteCooldown={minuteCooldown} setTheme={setTheme.bind(this)} theme={theme} />

        <Statistics nfts={nfts} />

        <NFTGraphDisplayController nfts={nfts} />

        <Box sx={{ margin: "auto", maxWidth: '1300px', width: '90%' }}>
          <TabContext value={nftTable}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs indicatorColor="secondary" onChange={handleNFTTableChange} value={nftTable} >
                <Tab label="Active Listings" value="active" />
                <Tab label="My VOX" value="mine" />
                {/*<Tab label="Sold Listings" value="sold" />*/}
              </Tabs>
            </Box>
            <TabPanel value="active">
              <NFTTable nfts={nfts} theme={theme} />
            </TabPanel>
            <TabPanel value="mine">
              <MyVOX account={account} nfts={nfts} setAccount={setAccount.bind(this)} />
            </TabPanel>
            <TabPanel value="sold">
              <SoldNFTTable nfts={soldNFTs} page={page} pageSize={pageSize} setPage={setPage} setPageSize={handleSoldNFTPageSizeChange} theme={theme} />
            </TabPanel>
          </TabContext>
        </Box>

    </ThemeProvider>
  );
}

export default App;
