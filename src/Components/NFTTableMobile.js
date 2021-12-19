import React, {useState} from 'react'
import {makeStyles} from "@material-ui/styles";
import {Dialog, Grid} from "@mui/material";

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

function NFTTableMobile (props) {
  const classes = styles();

  const [imageName, setImageName] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const columns = [
    {
      field: 'image',
      headerName: ' ',
      renderCell: (params) => (

            <img alt={params.row.name + " Logo"} height={35} src={params.row.image} />

      ),
      sortable: false,
      width: 20
    },
    {
      field: 'ethPerRarity',
      flex: 1,
      headerName: ' ',
      renderCell: (params) => (
        <Grid container onClick={() => window.open(params.row.opensea, "_blank")}>
          <Grid
            item
            style={{
              lineHeight: 'normal',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            xs={12}
          >
            {params.row.name}
          </Grid>
          <Grid item style={{lineHeight: 'normal'}} xs={3}><small>{params.row.price} <img alt="ETH" src="/ETH.svg" height={10}/></small></Grid>
          <Grid item style={{lineHeight: 'normal'}} xs={7}><small>Rarity: {params.row.rarity}</small></Grid>
          <Grid item style={{lineHeight: 'normal'}} xs={2}><small>{params.row.ethPerRarity.toFixed(4)}</small></Grid>
        </Grid>
      ),
      sortable: false,
      width: 60
    }
  ]

  return (
    <div>
      {props.nfts ?
        <div className={classes.root}>
          <BaseDataGrid
            columns={columns}
            disableColumnMenu
            rows={props.nfts}
            sortModel={[
              {
                field: 'ethPerRarity',
                sort: 'asc',
              },
            ]}
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

export default NFTTableMobile;