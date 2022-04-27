import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from "react-moralis";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MoralisProvider serverUrl="https://0za0boegoaxc.usemoralis.com:2053/server" appId="ZfwfFRyD5cvJZj8sXMOcNVwi7OtMzwKEQhjy9XAI">
      <App />
    </MoralisProvider>
  </React.StrictMode>
);

reportWebVitals();
