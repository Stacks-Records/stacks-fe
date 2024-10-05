import './index.css';
import App from './Components/App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Auth0Provider
      domain="dev-ir1afapwlg3vmpj0.us.auth0.com"
      clientId="KKtBH5BcRXKfzyBwocjUCoWBed5GW77S"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
      >
      <App />
    </Auth0Provider>
  </BrowserRouter>

);


reportWebVitals();