import React, {useEffect, useState} from 'react'
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Toolbar,
  Typography
} from "@mui/material";
import {Brightness2, Brightness7, LocalGasStation, Refresh} from "@mui/icons-material";

import * as Theme from "../Theme/index"

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
            <Button
              href="https://gasgas.io/"
              style={{
                backgroundColor: "#212121",
                borderRadius: "4px",
                float: "right",
                height: "80%",
                padding: "12px 16px"
              }}
              loadingIndicator="Loading..."
              size="large"
              startIcon={<LocalGasStation/>}
              variant="contained"
            >
              {gas.standard ? (gas.standard * .000000001).toFixed(0) : "---"}
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header;