import React from 'react'
import {Main} from "./components/Main";
import {AppConfigProvider} from "./config/config.context";
import classes from './App.module.css'

const MyApp = () => {
    return (
        <div className={classes.container}>
            <AppConfigProvider>
                <Main/>
            </AppConfigProvider>
        </div>
    );
};

export default MyApp;
