import React, {useState} from 'react'
import {makeStyles} from "@material-ui/styles";
import {Dialog, IconButton} from "@mui/material";
import {Launch} from "@mui/icons-material";

import BaseDataGrid from "./BaseDataGrid";

const styles = makeStyles({
  root: {
    height: 600,
    width: "100%",
    "& .MuiDataGrid-iconButtonContainer": {
      display: "none"
    },
    // NOTE: Doing display: none prevents the menu to be positioned correctly when opening it using the keyboard.
    "& .MuiDataGrid-menuIcon": {
      visibility: "hidden",
      width: 0
    },
    "& .MuiDataGrid-columnHeader:hover": {
      "& .MuiDataGrid-iconButtonContainer": {
        display: "flex"
      },
      "& .MuiDataGrid-menuIcon": {
        visibility: "visible",
        width: "auto"
      }
    },
    "& .MuiDataGrid-columnHeader.MuiDataGrid-columnHeader--sorted": {
      "& .MuiDataGrid-iconButtonContainer": {
        display: "flex"
      }
    }
  }
});

function NFTTable (props) {
  const classes = styles();

  const [imageName, setImageName] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const columns = [
    {
      field: 'image',
      flex: .2,
      headerName: ' ',
      renderCell: (params) => (
        <div style={{ cursor: "pointer" }}>
          <img
            alt={params.row.name}
            height={28}
            onClick={() => {setImageName(params.row.name); setImageURL(params.value)}}
            src={params.value}
            style={{
              verticalAlign: "middle"
            }}
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
      flex: .5,
      headerName: 'ETH/Rarity',
      renderCell: (params) => (
        (params.value)
          ? params.value.toFixed(6)
          : null
      ),
      type: 'number'
    },
    {
      field: 'rarityPerETH',
      flex: .5,
      headerName: 'Rarity/ETH',
      hide: true,
      renderCell: (params) => (
        (params.row.rarity && params.row.price)
          ? (params.row.rarity / params.row.price).toFixed(6)
          : null
      ),
      sortable: false,
      type: 'number'
    },
    {
      field: 'price',
      flex: .5,
      headerName: 'Price',
      renderCell: (params) => (
        params.value + " ETH"
      ),
      type: 'number'
    },
    {
      field: 'rank',
      flex: .5,
      headerName: 'Rank',
      type: 'number'
    },
    {
      field: 'rarity',
      flex: .5,
      headerName: 'Rarity',
      type: 'number'
    },
    {
      field: 'id',
      flex: .5,
      headerName: 'Rarity.tools',
      renderCell: (params) => (
        <IconButton
          color='inherit'
          onClick={() => window.open(`https://rarity.tools/collectvox${props.isMirandus ? 'mirandus' : ''}/view/${params.value}`, "_blank")}
          style={{
            textAlign: "center"
          }}
        >
          <Launch />
        </IconButton>
      ),
      sortable: false,
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
      sortable: false,
    }
  ]

  return (
    <div>
      {props.nfts ?
        <div className={classes.root}>
          <BaseDataGrid
            columns={columns}
            rows={props.nfts}
            theme={props.theme}
          />
        </div>
        : null
      }

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