const express = require('express');
const app = express();

const bodyParser = require('body-parser')
const fetch = require('node-fetch');
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => console.log(`Listening on port ${port}`));


app.post('/get-nfts', async (req, res) => {
  console.log(req.body.address)

  let cursor = null
  let nfts = []
  let nfts2 = []
  let total = 0

  let url = `https://deep-index.moralis.io/api/v2/${req.body.address}/nft?chain=eth&format=decimal`

  //Hopefully they don't have more than 1000 NFTs
  await fetch(
    url,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'qeVUxXNVn86CxoWejaVqlmDzo6R5Njc1dRJsmN2mUvtOUlBFt1XgkpSHS69yNhQK',
      }
    }
  )
  .then(res => res.json())
  .then(json => {
    cursor = json.cursor
    total = json.total

    nfts = json.result
  });

  if (nfts.length < total) {
    url += `&cursor=${cursor}`

    await fetch(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'qeVUxXNVn86CxoWejaVqlmDzo6R5Njc1dRJsmN2mUvtOUlBFt1XgkpSHS69yNhQK',
        }
      }
    )
      .then(res => res.json())
      .then(json => {
        nfts2 = json.result
      });
  }

  res.send(nfts.concat(nfts2))
});