# Marketing Dashboard Frontend

This is the frontend of a marketing dashboard built with React and TypeScript, designed to manage campaigns.

## Requirements

Before starting, make sure you have the following tools installed:

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [npm](https://www.npmjs.com/get-npm)

## Setup Instructions

To get the project running locally, follow these steps:

Clone the repository using the following command:

```bash
git clone https://github.com/DaryPet/marketing-dashboard-frontend.git
```

Navigate into the project directory:
cd marketing-dashboard-frontend

Install the required dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

## TEST USER

username - test_user1
password - testtest123

## Available API Endpoints

POST /api/auth/login: For user login, returns an access token and refresh token.

GET /api/campaigns: To fetch campaigns, requires an authenticated user.

POST /api/campaigns: To create a new campaign.

PUT /api/campaigns/{id}: To update an existing campaign.

DELETE /api/campaigns/{id}: To delete a campaign.
