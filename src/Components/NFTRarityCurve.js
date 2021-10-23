import React, {useState} from 'react'
import {Line} from "react-chartjs-2";
import rarity from '../data/VOX-rarity.json'
import {ToggleButton, ToggleButtonGroup} from "@mui/material";

function NFTValueCurve () {
  const [scaleType, setScaleType] = useState("logarithmic")

  const handleChange = (event, newValue) => {
    if (newValue)
      setScaleType(newValue);
  };

  const data = {
    datasets: [
      {
        label: 'VOX Rarity vs Price',
        data: rarity.map(nft => { return { x: nft.rank, y: nft.rarity, label: nft.id} }),
        backgroundColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          beginAtZero: false,
        },
        title: {
          display: true,
          text: 'Rank',
        },
        type: scaleType,
      },
      y: {
        title: {
          display: true,
          text: 'Rarity',
        },
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(ctx) {
            return [`Name: ${ctx.raw.label}`, `Rarity: ${ctx.raw.y}`, ` Rank: ${ctx.raw.x}`]
          }
        }
      }
    },
    tooltips: {
      enabled: false
    }
  };

  return (
    <div>
      <Line
        data={data}
        options={options}
      />

      <ToggleButtonGroup
        color="primary"
        value={scaleType}
        exclusive
        onChange={handleChange}
      >
        <ToggleButton value="logarithmic">Logarithmic</ToggleButton>
        <ToggleButton value="linear">Linear</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

export default NFTValueCurve;