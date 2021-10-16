import React, {useEffect, useState} from 'react'
import {DataGrid} from "@mui/x-data-grid";
import {Dialog, IconButton} from "@mui/material";
import {Launch} from "@mui/icons-material";

import 'bootstrap/dist/css/bootstrap.min.css'
import originalNFTs from "../data/VOX-10-14-2021.json";

function NFTTable () {
  const [imageName, setImageName] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

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
        (params.value)
          ? params.value.toFixed(6)
          : null

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
      flex: .5,
      headerName: 'Rarity',
    },
    {
      field: 'id',
      flex: .5,
      headerName: 'Rarity.tools',
      renderCell: (params) => (
        <IconButton
          color='inherit'
          onClick={() => window.open('https://rarity.tools/collectvox/view/' + params.value, "_blank")}
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

  const[nfts, setNFTs] = useState(originalNFTs)

  useEffect(() => {
    const removePurchasedNFTs = async (nfts) => {
      let openseaAPIURLs = []

      for (let start = 0; start < nfts.length; start += 30) {
        let end = start + 30

        if (end > nfts.length) {
          end = nfts.length
        }

        let tokenIds = ""

        nfts.slice(start, end).forEach((nft) => {
          tokenIds += "&token_ids=" + nft.id
        })

        openseaAPIURLs.push("https://api.opensea.io/api/v1/assets?asset_contract_address=0xad9fd7cb4fc7a0fbce08d64068f60cbde22ed34c&limit=30&" + tokenIds)
      }

      let assets = []

      await Promise.all(openseaAPIURLs.map(url => fetch(url)))
        .then(responses =>
          Promise.all(responses.map(res => res.json()))
        ).then(json => {
          if (json) {
            return json.forEach(subData => assets = assets.concat(subData.assets.filter(nft => nft.sell_orders)))
          }
          else {
            assets = nfts
          }
        }).catch(() =>  {
          console.log("Failed to connect to Opensea")

          assets = nfts
        })

      setNFTs(nfts.filter(nft => assets.map(asset => asset.token_id).includes(nft.id)))
    }

    removePurchasedNFTs(originalNFTs)
  }, [originalNFTs, setNFTs])

  return (
    <div>
      {nfts ?
        <DataGrid
          autoHeight
          columns={columns}
          columnBuffer={columns.length}
          disableColumnSelector
          disableSelectionOnClick
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          page={page}
          pageSize={pageSize}
          rows={nfts}
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
          sortModel={[{field: 'ethPerRarity', sort: 'asc'}]}
          style={{
            margin: 'auto',
            marginTop: '50px',
            width: '80%'
          }}
        />
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