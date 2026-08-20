# Stacks

A comprehensive vinyl record marketplace application built with React (React Router, Swiper) and Auth0 authentication, supported by an Express/Knex/PostgreSQL backend and deployed with Vercel.

## Table of Contents

- [Introduction](#introduction)
- [Preview](#preview)
- [Features](#features)
- [Installation](#installation)
- [Running the Cypress E2E tests](#running-the-cypress-e2e-tests)
- [Usage](#usage)
- [Wins](#wins)
- [Challenges](#challenges)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

Welcome to Stacks! This application allows users to browse, listen to, add to, and keep a digital collection of vinyl records. It provides a user-friendly interface and a robust back-end to ensure a seamless experience. Authentication is handled by Auth0 — users sign in with an email/password account or with Google.

## Preview 
### Click [here](https://stacks-records-client.vercel.app/) to check it out for yourself.
<img width="861" alt="Screenshot 2024-10-16 at 12 00 31 PM" src="https://github.com/user-attachments/assets/cf35eb93-83e1-442f-b183-e97cf01939a2">
<img width="1392" alt="Screenshot 2024-10-16 at 12 01 37 PM" src="https://github.com/user-attachments/assets/206cf4f7-c345-4229-abf0-97e6b7b97cd8">
<img width="442" alt="Screenshot 2024-10-16 at 12 02 03 PM" src="https://github.com/user-attachments/assets/ad049ea5-2398-4804-815a-bb04bc48ebff">
<img width="649" alt="Screenshot 2024-10-16 at 12 06 54 PM" src="https://github.com/user-attachments/assets/b8bbb649-7ce1-4757-ab55-3ccc1a7fe1e7">
<img width="455" alt="Screenshot 2024-10-16 at 12 07 32 PM" src="https://github.com/user-attachments/assets/20fac785-9322-40a4-a0da-56d577881eba">
<img width="541" alt="Screenshot 2024-10-16 at 12 08 31 PM" src="https://github.com/user-attachments/assets/cb07110d-89a3-4350-a877-7078c15d2670">

## Features

- User authentication and profile management via Auth0.
- Add records to personal stack, which persists beyond user's session.
- Filter records by genre, or search for a specific record or artist.
- Post, edit, and delete album records (gated by user role/ownership permissions).
- Role-based access control, including an admin user-management page.
- Responsive design for various devices.
- Cypress E2E specs under `cypress/e2e/` (`login.cy.js` is live, covering signup+email-verification and a stubbed Google login; the rest are disabled — see commit `1b1bde1`).

## Installation

1. Clone the repository:
   `git clone git@github.com:Stacks-Records/stacks-fe.git`

2. Install dependencies:
   `cd stacks && npm i`

3. Create a `.env` file in the project root with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:3001   # base URL of the backend API
   REACT_APP_DOMAIN=your-auth0-domain
   REACT_APP_CLIENT_ID=your-auth0-client-id
   REACT_APP_CLIENT_SECRET=your-auth0-client-secret
   REACT_APP_AUDIENCE=your-auth0-api-audience
   REACT_APP_SCOPE=openid profile email
   REACT_APP_AUTH0_USERNAME=an-existing-test-account-username
   REACT_APP_AUTH0_PASSWORD=that-account-password
   ```
   These are all consumed by `cypress.config.js` in addition to the app itself — see [Running the Cypress E2E tests](#running-the-cypress-e2e-tests) for the additional variables needed there.

4. Start the backend API. This frontend requires the Stacks API to be running — by default it expects it at `http://localhost:3001`. Clone and run it from [Stacks-Records/stacks-be](https://github.com/Stacks-Records/stacks-be).

5. Start the frontend with `npm start`. This runs the app on `http://localhost:3000` via `react-scripts`. If you hit `MODULE_NOT_FOUND` errors, confirm all dependencies installed (inspect `package.json`).

## Running the Cypress E2E tests

`cypress/e2e/login.cy.js` covers the two ways the app supports signing in, both exercised without ever driving a real Google OAuth consent screen (Google actively blocks automated browsers there):

- **Signup + email verification** — a real Auth0 account is created through the real Universal Login "Sign up" form, and a real verification email is polled for and clicked via IMAP against a test Gmail inbox.
- **Stubbed Google login** — an existing Google-social identity is simulated by seeding the Auth0 SDK's own token cache in `localStorage` (see `cypress/support/googleAuthStub.js`), with the backend calls this triggers mocked via `cy.intercept`.

Add these to `.env` in addition to the variables above:
```
GMAIL_TEST_EMAIL_BASE=your-test-account@gmail.com
GMAIL_TEST_APP_PASSWORD=your-16-char-app-password
AUTH0_SIGNUP_PASSWORD=a-password-meeting-your-tenant's-policy
```

`GMAIL_TEST_EMAIL_BASE` must be a real Gmail account with 2FA enabled, so an [App Password](https://myaccount.google.com/apppasswords) can be generated for `GMAIL_TEST_APP_PASSWORD` (IMAP access can't use the account's normal login password). The signup test never touches the inbox address directly — it appends a `+<timestamp>` alias (e.g. `your-test-account+1755555555@gmail.com`) for every run, which Gmail still delivers to the same inbox but Auth0 treats as a brand-new account each time, so repeated runs never collide with "user already exists."

Run with `npm run cypress` (interactive) or `npx cypress run` (headless).

## Usage
- Peruse the records available, including a feature that enables users to listen to them from the single record page once a record is clicked.
- Users may create My Stack, their own collection of records, either from the Landing Page or Single Record Page. Toss one out if you don't like it anymore.
- Users may post their own albums, provided they do their homework for all the input fields, and add it to My Stack. Data uniformity is paramount to application integrity at this time. 

## Deployment
The production app is deployed on Vercel: [stacks-records.vercel.app](https://stacks-records-client.vercel.app/). (Note: the `predeploy`/`deploy` `gh-pages` scripts in `package.json` are legacy and no longer used.)

## Wins
- Built the application from scratch, front end and back end.
- Deepened of Auth0, and seeding user interactions with the application in the back end based on authentication.
- Experienced first PATCH route that updates the My Stack column for each user in the back end.

## Challenges 
- Implementing Cypress testing for POST functionality
- Adding YouTube functionality for various video types
- Implementing Auth0, deepening experience with PostgreSQL, Knex, and Express. 

## Contributing

### Kyle Boomer
[Email](kylemboomer@gmail.com)
[LinkedIn](https://www.linkedin.com/in/kylemboomer/)

### Peter Kim
[Email](peterkim.pk1@gmail.coom)
[LinkedIn](https://www.linkedin.com/in/pk-2403fee/)

### Adam Konber
[Email](konber3@gmail.com)
[LinkedIn](https://www.linkedin.com/in/adam-konber/)

