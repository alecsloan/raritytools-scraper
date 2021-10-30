import React, {useState} from 'react'
import {Box, Tab, Tabs} from "@mui/material";
import {TabContext, TabPanel} from "@mui/lab";
import NFTValueCurve from "./NFTValueCurve";
import NFTRarityCurve from "./NFTRarityCurve";

function NFTGraphDisplayController (props) {
  const [value, setValue] = useState("1")

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  return (
    <Box sx={{ margin: "auto", width: '90%' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs indicatorColor="secondary" onChange={handleChange} value={value} >
            <Tab label="Value Curve" value="1" />
            <Tab label="Rarity Curve" value="2" />
            <Tab label="Hide" value="3" />
          </Tabs>
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