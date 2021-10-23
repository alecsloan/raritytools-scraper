import React, {useState} from 'react'
import {Box, Tab} from "@mui/material";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import NFTValueCurve from "./NFTValueCurve";
import NFTRarityCurve from "./NFTRarityCurve";

function NFTGraphDisplayController (props) {
  const [value, setValue] = useState("1")

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  return (
    <Box sx={{ width: '100%' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>
            <Tab label="Value Curve" value="1" />
            <Tab label="Rarity Curve" value="2" />
            <Tab label="Hide" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <NFTValueCurve nfts={props.nfts} />
        </TabPanel>
        <TabPanel value="2">
          <NFTRarityCurve nfts={props.nfts} />
        </TabPanel>
        <TabPanel value="3">
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default NFTGraphDisplayController;