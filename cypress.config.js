const { defineConfig } = require("cypress");
require("dotenv").config();
const registerGmailTasks = require("./cypress/support/tasks/gmail");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    taskTimeout: 90000,
    setupNodeEvents(on, config) {
      registerGmailTasks(on, config);
      return config;
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
    gmail_test_email_base: process.env.GMAIL_TEST_EMAIL_BASE,
    gmail_test_app_password: process.env.GMAIL_TEST_APP_PASSWORD,
    auth0_signup_password: process.env.AUTH0_SIGNUP_PASSWORD,
  },

  chromeWebSecurity: false,

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
