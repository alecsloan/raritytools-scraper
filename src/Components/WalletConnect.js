import React from 'react'
import {AccountBalanceWallet} from "@mui/icons-material";
import {Button} from "@mui/material";

function WalletConnect (props) {
  return (
    <Button
      onClick={async () => {
        if (!props.account) {
          const accounts = await window.ethereum.enable();
          props.setAccount(accounts[0]);
        }
        else {
          props.setAccount("")
        }
      }}
      style={{
        backgroundColor: "#2d365c",
        borderRadius: "4px",
        height: "80%",
        padding: "12px 16px",
        marginTop: '5px'
      }}
      size="large"
      startIcon={<AccountBalanceWallet />}
      variant="contained"
    >
      { props.account ? `${props.account.slice(0, 5)}...${props.account.slice(props.account.length - 3, props.account.length)}` : "Connect"}
    </Button>
  );
}

export default WalletConnect;