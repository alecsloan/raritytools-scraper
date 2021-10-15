import React, {useState} from 'react'
import {DataGrid} from "@mui/x-data-grid";
import {Dialog, IconButton} from "@mui/material";
import {Launch} from "@mui/icons-material";

import 'bootstrap/dist/css/bootstrap.min.css'

import nfts from '../data/VOX.json'

function NFTTable (props) {
  const [imageName, setImageName] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const columns = [
    {
      field: 'image',
      flex: .2,
      headerName: ' ',
      renderCell: (params) => (
        <div>
          <img
            alt={params.row.name}
            height={28}
            onClick={() => {setImageName(params.row.name); setImageURL(params.value)}}
            src={params.value}
          />
        </div>
      ),
      width: 60
    },
    {
      field: 'name',
      flex: 1,
      headerName: 'Name',
      width: 180,
    },
    {
      field: 'ethPerRarity',
      flex: 1,
      headerName: 'Eth/Rarity',
      renderCell: (params) => (
        params.value.toFixed(6)
      ),
      width: 120
    },
    {
      field: 'price',
      flex: .5,
      headerName: 'Price',
      renderCell: (params) => (
        params.value + " ETH"
      )
    },
    {
      field: 'rank',
      flex: .5,
      headerName: 'Rank',
    },
    {
      field: 'rarity',
      flex: .4,
      headerName: 'Rarity',
    },
    {
      field: 'id',
      flex: .5,
      headerName: 'Rarity.tools',
      renderCell: (params) => (
        console.log(params.value.replace('ID ', '')),
        <IconButton
          color='inherit'
          onClick={() => window.open('https://rarity.tools/collectvox/view/' + params.value.replace('ID ', ''), "_blank")}
          style={{
            textAlign: "center"
          }}
        >
          <Launch />
        </IconButton>
      ),
      width: 1
    },
    {
      field: 'opensea',
      flex: .5,
      headerName: 'Opensea',
      renderCell: (params) => (
        <IconButton
          color='inherit'
          onClick={() => window.open(params.value, "_blank")}
          style={{
            textAlign: "center"
          }}
        >
          <Launch />
        </IconButton>
      ),
      width: 1
    }
  ]

  return (
    <div>
      <DataGrid
        autoHeight
        columns={columns}
        columnBuffer={columns.length}
        pageSize={20}
        rows={nfts.filter((nft) => nft.ethPerRarity > 0)}
        sortModel={[
          {
            field: 'ethPerRarity',
            sort: 'asc',
          },
        ]}
        style={{
          margin: 'auto',
          marginTop: '50px',
          width: '80%'
        }}
      />

      <Dialog onClose={() => {setImageName(null); setImageURL(null)}} open={imageName !== null && imageURL !== null}>
        <img
          alt={imageName}
          src={imageURL}
        />
      </Dialog>
    </div>
  );
}

export default NFTTable;