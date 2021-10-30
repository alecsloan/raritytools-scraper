import {Box, Paper, Typography} from "@mui/material";

export default function Statistics(props) {

  const rarityPerEthValues = props.nfts.map(nft => nft.price / nft.rarity)

  const sum = rarityPerEthValues.reduce((sum, val) => (sum += val))

  const average = sum / props.nfts.length

  const rarityPerEthSortedValues = rarityPerEthValues.sort()

  const middle = Math.ceil(rarityPerEthSortedValues.length / 2)

  const median = rarityPerEthSortedValues.length % 2 === 0
    ? (rarityPerEthSortedValues[middle] + rarityPerEthSortedValues[middle - 1]) / 2
    : rarityPerEthSortedValues[middle - 1]

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          borderLeft: 4,
          m: 2,
          width: 128,
          height: 72,
        },
      }}
    >
      <Paper elevation={9}>
        <Typography align="center" height="100%">
          Low <br /> {rarityPerEthSortedValues[0].toFixed(6)}
        </Typography>
      </Paper>
      <Paper elevation={9}>
        <Typography align="center" height="100%">
          Median <br /> {median.toFixed(6)}
        </Typography>
      </Paper>
      <Paper elevation={9}>
        <Typography align="center" height="100%">
          Average <br /> {average.toFixed(6)}
        </Typography>
      </Paper>
    </Box>
  )
}