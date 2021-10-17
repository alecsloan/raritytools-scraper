import React from 'react'
import {Scatter} from "react-chartjs-2";

function NFTPriceScatterPlot (props) {
  const uniqueNFTs =
    Array.from(
      new Set(props.nfts.map(nft => nft.id)))
      .map(id => {
        return props.nfts.find(nft => nft.id === id)
      })

  const data = {
    datasets: [
      {
        label: 'VOX Rarity vs Price',
        data: uniqueNFTs.map(nft => { return { x: nft.price, y: nft.rarity, label: nft.name} }),
        backgroundColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          beginAtZero: false,
          callback: function(value, index, values) {
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
    plugins: {
      tooltip: {
        callbacks: {
          label: function(ctx) {
            return [`Name: ${ctx.raw.label}`, `Rarity: ${ctx.raw.y}`, ` Price: ${ctx.raw.x}`]
          }
        }
      }
    },
    tooltips: {
      enabled: false
    }
  };

  return (
    <Scatter
      data={data}
      options={options}
    />
  );
}

export default NFTPriceScatterPlot;