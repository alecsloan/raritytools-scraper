import React, {useEffect, useState} from 'react'
import {Dialog, IconButton} from "@mui/material";
import {Launch} from "@mui/icons-material";

import BaseDataGrid from "./BaseDataGrid";

function NFTTable (props) {
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
      flex: 1,
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
          onClick={() => window.open('https://rarity.tools/collectvox/view/' + params.value, "_blank")}
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

  const[nfts, setNFTs] = useState(props.nfts)

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

      if (assets.length === nfts.length) {
        setNFTs(nfts)

        return
      }

      setNFTs(nfts.filter(nft => assets.map(asset => asset.token_id).includes(nft.id)))
    }

    removePurchasedNFTs(props.nfts)
  }, [setNFTs, props.nfts])

  return (
    <div>
      {nfts ?
        <BaseDataGrid
          columns={columns}
          rows={nfts}
          theme={props.theme}
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