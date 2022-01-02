import React, {useEffect, useState} from 'react'
import {
    AppBar,
    Box,
    Button,
    CircularProgress, Dialog,
    Grid,
    IconButton,
    Toolbar,
    Typography
} from "@mui/material";
import {Brightness2, Brightness7, Calculate, LocalGasStation, Refresh} from "@mui/icons-material";

import * as Theme from "../Theme/index"
import GalaPower from "./GalaPower";

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress style={{ color: '#2d365c'}} variant="determinate" {...props} />
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
        <Typography variant="caption" component="div" color="#fff">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

function Header (props) {
  const [time, setTime] = useState(Date.now());
  const [gas, setGas] = useState(false)
  const [gpPanelOpen, setGPPanelOpen] = useState(false)

  let dataUpdated = localStorage.getItem("dataUpdated")

  if (props.table === 'mirandus') {
      dataUpdated = localStorage.getItem("mirandusDataUpdated")
  }

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

  useEffect(
    () => {
      const socket = new WebSocket('wss://gasgas.io/prices')

      socket.addEventListener("message", (event) => {
        setGas(JSON.parse(event.data).data)
      });
    }
  )

  const cooldownPercent = ((time - dataUpdated) / (props.minuteCooldown * 60000) * 100)

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container>
          <Grid item xs={6}>
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

          <Grid item xs={6}>
            <Button
              href="https://gasgas.io/"
              style={{
                backgroundColor: "#2d365c",
                borderRadius: "4px",
                float: "right",
                height: "80%",
                padding: "12px 16px",
                marginTop: '5px'
              }}
              size="large"
              startIcon={<LocalGasStation/>}
              variant="contained"
            >
              {gas.standard ? (gas.standard * .000000001).toFixed(0) : "---"}
            </Button>
            <Button
              onClick={() => {
                  setGPPanelOpen(true)
              }}
              style={{
                  backgroundColor: "#2d365c",
                  borderRadius: "4px",
                  float: "right",
                  height: "80%",
                  padding: "12px 16px",
                  marginTop: '5px',
                  marginRight: '5px'
              }}
              size="large"
              startIcon={<Calculate />}
              variant="contained"
            >
              GP
            </Button>
          </Grid>
        </Grid>
      </Toolbar>

      <Dialog maxWidth="md" onClose={() => {setGPPanelOpen(null);}} open={gpPanelOpen}>
        <GalaPower account={props.account} />
      </Dialog>
    </AppBar>
  );
}

export default Header;