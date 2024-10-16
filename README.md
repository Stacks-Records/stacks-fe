# Stacks

A comprehensive vinyl record marketplace application built with React, supported by an Express/Knex/PostGreSQL backend and deployed with Vercel.

## Table of Contents

- [Introduction](#introduction)
- [Preview](#preview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Wins](#wins)
- [Challenges](#challenges)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

Welcome to Stacks! This application allows users to browse, listen to, add to, and keep a digital collection of vinyl records. It provides a user-friendly interface and a robust back-end to ensure a seamless experience. Users must be authenticated by either creating an Okta account or through their Google email account to use the application. 

## Preview 
### Click [here](https://stacks-records.vercel.app/) to check it out for yourself.
<img width="861" alt="Screenshot 2024-10-16 at 12 00 31 PM" src="https://github.com/user-attachments/assets/cf35eb93-83e1-442f-b183-e97cf01939a2">
<img width="1392" alt="Screenshot 2024-10-16 at 12 01 37 PM" src="https://github.com/user-attachments/assets/206cf4f7-c345-4229-abf0-97e6b7b97cd8">
<img width="442" alt="Screenshot 2024-10-16 at 12 02 03 PM" src="https://github.com/user-attachments/assets/ad049ea5-2398-4804-815a-bb04bc48ebff">
<img width="649" alt="Screenshot 2024-10-16 at 12 06 54 PM" src="https://github.com/user-attachments/assets/b8bbb649-7ce1-4757-ab55-3ccc1a7fe1e7">
<img width="455" alt="Screenshot 2024-10-16 at 12 07 32 PM" src="https://github.com/user-attachments/assets/20fac785-9322-40a4-a0da-56d577881eba">
<img width="541" alt="Screenshot 2024-10-16 at 12 08 31 PM" src="https://github.com/user-attachments/assets/cb07110d-89a3-4350-a877-7078c15d2670">

## Features

- User authentication and profile management. 
- Add records to personal stack, which persists beyond user's session.
- Filter records by genre, or search for a specific record or artist.
- Responsive design for various devices.
- Cypress tests for critical user flows. 

## Installation

1. Clone the repository:
   git clone git@github.com:Stacks-Records/stacks-fe.git

2. Then type this into your terminal: 
cd stacks && npm i

3. Allow the dependencies to install, then: npm start. Side note: confirm all dependencies are installed. Not MODULE_NOT_FOUND errors, or inspect the package.json file to confirm you've got everything installed. 

## Usage
- Peruse the records available, including a feature that enables users to listen to them from the single record page once a record is clicked.
- Users may create My Stack, their own collection of records, either from the Landing Page or Single Record Page. Toss one out if you don't like it anymore.
- Users may post their own albums, provided they do their homework for all the input fields, and add it to My Stack. Data uniformity is paramount to application integrity at this time. 

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

