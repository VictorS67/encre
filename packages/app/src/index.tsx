import './browser-preload';

import React from 'react';

import ReactDOM from 'react-dom/client';

import { send } from 'internal/src/fetch';

import './colors.css';
import './index.css';
import './scrollbar.css';
import './animation.css';
import App from './App';
import { handleGlobalEvents } from './global-events';
import reportWebVitals from './reportWebVitals';

handleGlobalEvents();

declare global {
  interface Window {
    $send: typeof send;
  }
}

window.$send = send;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
