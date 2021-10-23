import React, {useState} from 'react'
import {Alert, AlertTitle, AppBar, Button, IconButton, Slide, Snackbar, Toolbar} from "@mui/material";
import {Brightness2, Brightness7, ThumbUp} from "@mui/icons-material";

import * as Theme from "../Theme/index"

function Header (props) {
  const [theyUnderstand, setTheyUnderstand] = useState(localStorage.getItem("theyUnderstand"));

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

      <Snackbar
        key={"understand"}
        open={!theyUnderstand}
      >
        <Alert
          action={
            <IconButton
              aria-label="got-it"
              color="inherit"
              onClick={() => {
                localStorage.setItem("theyUnderstand", true)
                setTheyUnderstand(true)
              }}
              size="small"
            >
              <ThumbUp />
            </IconButton>
          }
          severity='info'
        >
          This is a community project and not affiliated with Gala Games.
        </Alert>
      </Snackbar>
    </AppBar>
  );
}

export default Header;