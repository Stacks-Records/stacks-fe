const { defineConfig } = require('cypress')
// Populate process.env with values from .env file
require('dotenv').config()

module.exports = defineConfig({
  env: {
    auth0_username: process.env.AUTH0_USERNAME,
    auth0_password: process.env.AUTH0_PASSWORD,
    auth0_domain: process.env.REACT_APP_DOMAIN,
    auth0_audience: process.env.REACT_APP_AUDIENCE,
    auth0_scope: process.env.REACT_APP_SCOPE,
    auth0_client_id: process.env.REACT_APP_CLIENT_ID,
    auth0_client_secret: process.env.REACT_APP_CLIENT_SECRET,
  },
})