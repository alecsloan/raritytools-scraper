import {Box, Paper, Typography} from "@mui/material";

export default function Statistics(props) {
  if (!props.low || !props.median)
    return null

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > div:not(style)': {
          borderColor: '#6f7acd'
        },
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
          Low <br /> {Number(props.low).toFixed(6)}
        </Typography>
      </Paper>
      <Paper elevation={9}>
        <Typography align="center" height="100%">
          Median <br /> {Number(props.median).toFixed(6)}
        </Typography>
      </Paper>
    </Box>
  )
}