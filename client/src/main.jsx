import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx';
import './index.css';
import { GeneralProvider } from './context/GeneralContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GeneralProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </GeneralProvider>
    </BrowserRouter>
  </React.StrictMode>
);
