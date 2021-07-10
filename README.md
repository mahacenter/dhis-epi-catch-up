# Maha DHIS EPI catch-up

## Requirements
nodejs v11 is required to run or build this app

## Install it on your own DHIS instance

### Configuration
Some features of this app target specifics indicators.
So you have to update variables in `src/js/customDhisVariables.js` to match indicators ids of your own instance. The ids could be found using the pivot-table app (or any other app) while inspecting the network panel of your browser.

The following screenshots show how to find the `ids` of indicators and data-elements in your DHIS.
- [Find the INDICATOR_GROUPS.IMMUNIZATION id](http://images.mahacenter.com/epi-catch-up/find_group_id.jpg)
- [Find the DATA_GROUPS.IMMUNIZATION id](http://images.mahacenter.com/epi-catch-up/find_data_element_group_id.jpg)
- [Find the INDICATORS.* ids](http://images.mahacenter.com/epi-catch-up/find_indicator_id.jpg)

### Build
- Run `npm install`
- And `npm run build`
  for building the app, the result will be a .zip file to be uploaded into the given DHIS2 instance in the "App Management" panel.

## Contribute

### How-to use
- Run `npm install`
- Then `npm start` for development

### Env parameters
(Might be worth to refactor)
- API version to be set in both :
    - ./.env
    - ./src/js/api.js

- API URL in both :
    - ./.env.development
    - ./src/js/api.js
