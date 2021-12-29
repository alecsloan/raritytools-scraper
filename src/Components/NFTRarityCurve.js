import React, {useState} from 'react'
import {Line} from "react-chartjs-2";
import townStarRarity from '../data/VOX-rarity.json'
import mirandusRarity from '../data/Mirandus-VOX-rarity.json'
import {ToggleButton, ToggleButtonGroup} from "@mui/material";

function NFTValueCurve (props) {
  const [scaleType, setScaleType] = useState("logarithmic")

  let rarity

  if (props.table === 'mirandus') {
    rarity = mirandusRarity
  }
  else {
    rarity = townStarRarity
  }

  const handleChange = (event, newValue) => {
    if (newValue)
      setScaleType(newValue);
  };

  const data = {
    datasets: [
      {
        label: 'VOX Rarity vs Rank',
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
            return [`Id: ${ctx.raw.label}`, ` Rank: ${ctx.raw.x}`, `Rarity: ${ctx.raw.y}`]
          }
        }
      }
    },
    tooltips: {
      enabled: false
    },
    normalized: true
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