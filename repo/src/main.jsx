import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';
import ResizeObserver from 'resize-observer-polyfill';

if (!window.ResizeObserver) {
  window.ResizeObserver = ResizeObserver;
}

function handleResizeObserverError() {
  const resizeObserverErrorHandler = () => {
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
    });
  };

  try {
    new ResizeObserver(resizeObserverErrorHandler).observe(document.body);
  } catch (e) {
    if (e.message.includes('ResizeObserver loop completed with undelivered notifications')) {
      e.stopImmediatePropagation();
    }
  }
}
handleResizeObserverError();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Router>
);