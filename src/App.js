import './App.css';
import csvDownload from 'json-to-csv-export'
import {useEffect, useState} from "react";
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import {Download, Send} from "@mui/icons-material";

function App() {
  const [address, setAddress] = useState()
  const [inputAddress, setInputAddress] = useState("")
  const [nfts, setNFTs] = useState([])

  useEffect(() => {
    const getNFTs = async (lookupAddress) => {

      await fetch('/get-nfts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({address: lookupAddress})
      })
      .then(res => res.json())
      .then(json => {
        setNFTs(json)
      });
    }


    if (address)
      getNFTs(address)
  }, [address])

  return (
    <div className="App App-header">
      <Grid container padding={5} spacing={3}>
        <Grid item xs={10}>
          <TextField fullWidth id="address" label="Address" onChange={(event => setInputAddress(event.target.value))} value={inputAddress} variant="filled" />
        </Grid>
        <Grid item xs={2}>
          <Button
            fullWidth
            endIcon={<Send />}
            onClick={() => {
              setAddress(inputAddress)
            }}
            variant="contained"
          >
            Query
          </Button>
        </Grid>
      </Grid>
      {nfts.length > 0 ? "Total Unique NFTs: " + nfts.length : "Insert the wallet address above"}
      <Button
        disabled={nfts.length < 1}
        endIcon={<Download />}
        onClick={() => {
          csvDownload(nfts)
        }}
        variant="contained"
      >
        Download CSV
      </Button>
      <TableContainer sx={{ maxWidth: "50%", minWidth: 650 }} component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Collection</TableCell>
              <TableCell>NFT</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nfts?.map((nft) => (
              <TableRow
                key={nft.token_id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{nft.name}</TableCell>
                <TableCell>{JSON.parse(nft.metadata)?.name || nft.token_id}</TableCell>
                <TableCell>{nft.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
