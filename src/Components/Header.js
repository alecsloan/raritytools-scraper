import React, {useEffect, useState} from 'react'
import {Alert, AppBar, Box, CircularProgress, Grid, IconButton, Snackbar, Toolbar, Typography} from "@mui/material";
import {Brightness2, Brightness7, LocalGasStation, Refresh, ThumbUp} from "@mui/icons-material";

import * as Theme from "../Theme/index"
import {LoadingButton} from "@mui/lab";

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

function Header (props) {
  const [theyUnderstand, setTheyUnderstand] = useState(localStorage.getItem("theyUnderstand"))
  const [gas, setGas] = useState(false)

  const dataUpdated = localStorage.getItem("dataUpdated")

  const cooldownPercent = ((new Date().getTime() - dataUpdated) / (props.minuteCooldown * 60000) * 100)

  useEffect(
    () => {
      const socket = new WebSocket('wss://gasgas.io/prices')

      socket.addEventListener("message", (event) => {
        setGas(JSON.parse(event.data).data)
      });

      return () => {
        socket.close()
      }
    }
  )

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container>
          <Grid item xs={3}>
            <IconButton
              size="large"
              edge="end"
              aria-label="Change Theme"
              onClick={() => props.setTheme(props.theme.palette.mode === "dark" ? Theme.light : Theme.dark)}
              color="inherit"
            >
              {props.theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness2 /> }
            </IconButton>
            <IconButton
              aria-label='mode'
              className='p-1 pull-left'
              color='inherit'
              disabled={dataUpdated && (cooldownPercent < 100)}
              onClick={() => {
                if (cooldownPercent >= 100) {
                  props.getNFTs()
                }
              }}
              title='Refresh Data'
            >
              {
                (dataUpdated && (cooldownPercent < 100))
                  ? <CircularProgressWithLabel value={cooldownPercent} />
                  : <Refresh />
              }
            </IconButton>
          </Grid>

          <Grid item xs={6} />

          <Grid item xs={3}>
            <LoadingButton
              style={{
                height: "100%"
              }}
              loading={!gas}
              loadingIndicator="Loading..."
              onClick={() => window.open('https://gasgas.io/', "_blank")}
              size="large"
              startIcon={<LocalGasStation/>}
              variant="outlined"
            >
              {gas.standard ? (gas.standard * .000000001).toFixed(0) : "---"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Toolbar>

      <Snackbar
        key={"understand"}
        open={!theyUnderstand}
      >
        <Alert
          action={
            <IconButton
              aria-label="got-it"
              color="inherit"
              onClick={() => {
                localStorage.setItem("theyUnderstand", true)
                setTheyUnderstand(true)
              }}
              size="small"
            >
              <ThumbUp />
            </IconButton>
          }
          severity='info'
        >
          This is a community project and not affiliated with Gala Games.
        </Alert>
      </Snackbar>
    </AppBar>
  );
}

export default Header;