This project was bootstrapped with [DHIS2 Application Platform](https://github.com/dhis2/app-platform).

# Maha DHIS EPI catch-up

## Requirements
nodejs v15 is required to run or build this app

ensure to have yarn v1:
    
    yarn set version 1.22.19

### Run a dhis2 instance locally

Create a postgres instance

    docker run --name dhis-pg --env POSTGRES_PASSWORD=dhis --env POSTGRES_DB=dhis2 -d -p 5432:5432 postgis/postgis

Download the demo data at https://databases.dhis2.org/. Then populate the database with:

    gunzip dhis2-db-sierra-leone.sql.gz
    docker exec -i dhis-pg psql -d dhis2 -U postgres < dhis2-db-sierra-leone.sql

Create the dhis2 instance

    docker run -d --link dhis-pg --name dhis2 -p 8080:8080 -v $PWD/docker:/DHIS2_home dhis2/core:2.37.8

- Open http://localhost:8080 and login
- Open "Data Administration"
- Update the analytics tabLes

## Available Scripts

In the project directory, you can run:

### `yarn`
### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner and runs all available tests found in `/src`.<br />

See the section about [running tests](https://platform.dhis2.nu/#/scripts/test) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
A deployable `.zip` file can be found in `build/bundle`!

See the section about [building](https://platform.dhis2.nu/#/scripts/build) for more information.

### `yarn deploy`

Deploys the built app in the `build` folder to a running DHIS2 instance.<br />
This command will prompt you to enter a server URL as well as the username and password of a DHIS2 user with the App Management authority.<br/>
You must run `yarn build` before running `yarn deploy`.<br />

See the section about [deploying](https://platform.dhis2.nu/#/scripts/deploy) for more information.

## Learn More

You can learn more about the platform in the [DHIS2 Application Platform Documentation](https://platform.dhis2.nu/).

You can learn more about the runtime in the [DHIS2 Application Runtime Documentation](https://runtime.dhis2.nu/).

To learn React, check out the [React documentation](https://reactjs.org/).
