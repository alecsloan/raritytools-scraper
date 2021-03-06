import React, {useCallback, useEffect, useState} from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid, IconButton, Paper,
  Table, TableBody, TableCell, TableHead,
  TableRow,
  Typography
} from "@mui/material";
import townStarVoxRarity from "../data/VOX-rarity.json";
import mirandusVoxRarity from "../data/Mirandus-VOX-rarity.json";
import WalletConnect from "./WalletConnect";
import {useSnackbar} from "notistack";
import {Refresh} from "@mui/icons-material";

function MyVOX (props) {
  const {enqueueSnackbar} = useSnackbar()

  const [cards, setCards] = useState(null)
  const [ethPrice, setEthPrice] = useState(0)
  const [voxValues, setVoxValues] = useState(null)
  const [requestFailed, setRequestFailed] = useState(false)

  const getVox = useCallback(async () => {
    if (props.account && !cards) {
      setEthPrice(await window.fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum`)
        .then(response => response.json())
        .then(response => {
          return response[0].current_price
        })
      )

      await Promise.all([fetch(`https://data.rarity.tools/api/proxy/api/v1/assets?owner=${props.account}&order_direction=desc&offset=0&limit=50&collection=collectvox`), fetch(`https://data.rarity.tools/api/proxy/api/v1/assets?owner=${props.account}&order_direction=desc&offset=0&limit=50&collection=collectvoxmirandus`)])
        .then(responses =>
            Promise.all(responses.map(res => res.json()))
        ).then(json => {
          setRequestFailed(false)

          if (json.length === 2) {
            json[0].assets.push.apply(json[0].assets, json[1].assets)

            let temp = []

            const assets = []

            json[0].assets.forEach(vox => {
              const slug = vox.collection.slug

              let foundVox

              if (slug === "collectvox") {
                foundVox = townStarVoxRarity.find(v => v.id === vox.token_id);
              }
              else {
                foundVox = mirandusVoxRarity.find(v => v.id === vox.token_id);
              }

              assets.push({
                collection: slug,
                image: vox.image_url,
                name: vox.name,
                opensea: vox.permalink,
                rank: foundVox.rank,
                rarity: foundVox.rarity,
                rarity_tools: `https://rarity.tools/${slug}/view/${vox.token_id}`,
                token_id: vox.token_id
              })
            });

            let lowTotal = 0
            let medianTotal = 0

            assets.sort((a, b) => b.rarity - a.rarity).forEach(vox => {
              let low
              let median

              if (vox.collection === "collectvox")  {
                low = props.townStarLow
                median = props.townStarMedian
              }
              else {
                low = props.mirandusLow
                median = props.mirandusMedian
              }

              const ethLow = (vox.rarity * low).toFixed(2);
              const ethMedian = (vox.rarity * median).toFixed(2);

              lowTotal += Number(ethLow)
              medianTotal += Number(ethMedian)

              temp.push(
                  <Grid item xs={12} md={6} lg={4} key={vox.token_id}>
                    <Card>
                      <CardMedia
                          component="img"
                          height="300"
                          image={vox.image}
                          alt={vox.name}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {vox.name}
                        </Typography>
                        <Typography variant="body2">
                          <Grid container>
                            <Grid xs={6}>
                              Rank: {vox.rank}
                            </Grid>
                            <Grid xs={6}>
                              Rarity: {vox.rarity}
                            </Grid>
                          </Grid>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell />
                                <TableCell>Low</TableCell>
                                <TableCell>Median</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>ETH</TableCell>
                                <TableCell>{ethLow}</TableCell>
                                <TableCell>{ethMedian}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>USD</TableCell>
                                <TableCell>
                                  {
                                    ((vox.rarity * low).toFixed(2) * ethPrice).toLocaleString(
                                        window.navigator.language,
                                        {
                                          currency: "usd",
                                          maximumFractionDigits: 0,
                                          style: "currency"
                                        })
                                  }
                                </TableCell>
                                <TableCell>
                                  {
                                    ((vox.rarity * median).toFixed(2) * ethPrice).toLocaleString(
                                        window.navigator.language,
                                        {
                                          currency: "usd",
                                          maximumFractionDigits: 0,
                                          style: "currency"
                                        })
                                  }
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button color="secondary" href={vox.rarity_tools} size="small" target="_blank">Rarity Tools</Button>
                        <Button color="secondary" href={vox.opensea} size="small" target="_blank">Opensea</Button>
                      </CardActions>
                    </Card>
                  </Grid>
              )
            })

            setVoxValues({
              low: lowTotal,
              median: medianTotal,
            })
            setCards(temp)
          }
        }).catch(() =>  {
          if (!requestFailed) {
            enqueueSnackbar(`Opensea rejected your request for VOX data. Try again in a minute.`, {variant: 'error'})
            setRequestFailed(true)
          }
        })
    }
  }, [cards, enqueueSnackbar, ethPrice, props.account, props.mirandusLow, props.mirandusMedian, props.townStarLow, props.townStarMedian, requestFailed, setCards, setEthPrice])

  useEffect(() => {
    getVox()
  }, [getVox])

  return (
    <div style={{textAlign: "center"}}>
      {
        props.account && requestFailed
        ? <IconButton
                aria-label='mode'
                className='p-1 pull-left'
                color='inherit'
                onClick={() => {
                  getVox()
                }}
                title='Get VOX'
            >
              <Refresh />
            </IconButton>
        : null
      }

      <WalletConnect account={props.account} setAccount={props.setAccount} />
      {
        !props.account
        ? <h4 style={{margin: "10px auto", maxWidth: 400}}>This only grants view permissions for your wallet address. This can be removed anytime via your web3 wallet.</h4>
        : null
      }

      {
        voxValues
          ? <Box
            alignItems="center"
            justifyContent="center"
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              '& > div:not(style)': {
                borderColor: '#6f7acd'
              },
              '& > :not(style)': {
                borderLeft: 4,
                m: 2,
                width: 128,
                height: 72,
              },
            }}
          >
            <Paper elevation={9}>
              <Typography align="center" height="100%">
                Low <br />
                {voxValues.low.toFixed(2)} ETH <br />
                {
                  (voxValues.low * ethPrice).toLocaleString(
                    window.navigator.language,
                    {
                      currency: "usd",
                      maximumFractionDigits: 0,
                      style: "currency"
                    })
                }
              </Typography>
            </Paper>
            <Paper elevation={9}>
              <Typography align="center" height="100%">
                Median <br />
                {voxValues.median.toFixed(2)} ETH <br />
                {
                  (voxValues.median * ethPrice).toLocaleString(
                    window.navigator.language,
                    {
                      currency: "usd",
                      maximumFractionDigits: 0,
                      style: "currency"
                    })
                }
              </Typography>
            </Paper>
          </Box>
          : null
      }

      <Grid container spacing={2} style={{marginTop: "10px"}}>
        {cards}
      </Grid>
    </div>
  );
}

export default MyVOX;