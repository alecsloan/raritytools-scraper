import React from 'react'
import {AppBar, IconButton, Toolbar} from "@mui/material";
import {Brightness2, Brightness7} from "@mui/icons-material";

import * as Theme from "../Theme/index"

function Header (props) {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="end"
          aria-label="Change Theme"
          onClick={() => props.setTheme(props.theme.palette.mode === "dark" ? Theme.light : Theme.dark)}
          color="inherit"
        >
          {props.theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness2 /> }
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;