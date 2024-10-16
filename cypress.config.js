const { defineConfig } = require("cypress");
require('dotenv').config()

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      
    },
  },
  env: {
    auth0_username: process.env.REACT_APP_AUTH0_USERNAME,
    auth0_password: process.env.REACT_APP_AUTH0_PASSWORD,
    auth0_domain: process.env.REACT_APP_DOMAIN,
    auth0_audience: process.env.REACT_APP_AUDIENCE,
    auth0_scope: process.env.REACT_APP_SCOPE,
    auth0_client_id: process.env.REACT_APP_CLIENT_ID,
    auth0_client_secret: process.env.REACT_APP_CLIENT_SECRET,
  },
   chromeWebSecurity: false
});
