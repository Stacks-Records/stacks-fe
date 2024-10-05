import './index.css';
import React from 'react';
import ReactDOM from 'react-dom'
import App from './Components/App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
const domain = process.env.REACT_APP_DOMAIN
const clientId = process.env.REACT_APP_CLIENT_ID
root.render(
  <BrowserRouter>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
      >
      <App />
    </Auth0Provider>
  </BrowserRouter>

);


reportWebVitals();