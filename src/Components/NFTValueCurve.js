import React from 'react'
import {Scatter} from "react-chartjs-2";
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import {Button, IconButton, Tooltip, Typography} from "@mui/material";
import {Info} from "@mui/icons-material";

Chart.register(zoomPlugin);

function NFTValueCurve (props) {
  const uniqueNFTs =
    Array.from(
      new Set(props.nfts.map(nft => nft.id)))
      .map(id => {
        return props.nfts.find(nft => nft.id === id)
      })

  let nftChart = null;

  const data = {
    datasets: [
      {
        label: 'VOX Rarity vs Price',
        data: uniqueNFTs.map(nft => { return { x: nft.price, y: nft.rarity, label: nft.name} }),
        backgroundColor: '#6f7acd',
      },
    ],
  };

  const options = {
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          modifierKey: 'shift'
        },
        zoom: {
          wheel: {
            enabled: true,
            modifierKey: 'shift'
          },
          drag: {
            enabled: true,
            modifierKey: 'ctrl'
          },
          onZoom: function({chart}) { nftChart = chart }
        },
      },
      tooltip: {
        callbacks: {
          label: function(ctx) {
            return [`Name: ${ctx.raw.label}`, `Rarity: ${ctx.raw.y}`, ` Price: ${ctx.raw.x}`]
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          beginAtZero: false,
          callback: function(value) {
            if (value === 0.5) return "0.5 ETH"
            if (value === 1) return "1 ETH"
            if (value === 2) return "2 ETH"
            if (value === 5) return "5 ETH"
            if (value === 10) return "10 ETH"
            if (value === 50) return "50 ETH"
            if (value === 200) return "200 ETH"
            if (value === 2000) return "2000 ETH"
          }
        },
        title: {
          display: true,
          text: 'Price',
        },
        type: 'logarithmic',
      },
      y: {
        title: {
          display: true,
          text: 'Rarity',
        },
      }
    },
    tooltips: {
      enabled: false
    }
  };

  return (
    <div>
      <Scatter
        data={data}
        options={options}
      />
      <Button
        disabled={nftChart !== null}
        onClick={() => nftChart ? nftChart.resetZoom() : null}>
        Reset Zoom
      </Button>
      <Tooltip
        placement="top"
        title={
          <React.Fragment>
            <Typography color="inherit" fontSize={20}>About Zooming</Typography>
            <h3>Shift + mouse wheel to zoom.</h3>
            <h3>Shift + drag the mouse to pan.</h3>
            <h3>CTRL + drag the mouse to select.</h3>
          </React.Fragment>
        }
      >
        <IconButton>
          <Info />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default NFTValueCurve;