# Maha DHIS EPI catch-up

## Configure this app to your DHIS instance
Some features of this app target specifics indicators.
So you have to update variables in `src/js/customDhisVariables.js` to match indicators ids of your own instance. The ids could be found using the pivot-table app (or any other app) while inspecting the network panel of your browser.

## How-to use
- Run `npm install`
- Then `npm start` for development
- And `npm run build` for building the app, the result will be a .zip file to be uploaded into the given DHIS2 instance.

## Env parameters
(Might be worth to refactor)
- API version to be set in both :
  - ./.env
  - ./src/js/api.js

- API URL in both :
  - ./.env.development
  - ./src/js/api.js
