import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {SnackbarProvider} from "notistack";

const ref = React.createRef();

ReactDOM.render(
  <SnackbarProvider maxSnack={2} ref={ref}>
    <App notistackRef={ref} />
  </SnackbarProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
