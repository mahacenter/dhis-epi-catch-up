import React, { useEffect } from 'react';
import { useDataMutation, useDataQuery } from '@dhis2/app-runtime';
import { isEmpty } from 'lodash/fp';
import { ConfigApp } from './config.app';

export const ConfigContext = React.createContext();
export const useAppConfig = () => React.useContext(ConfigContext);

const APP_NAMESPACE_KEY = 'maha-dhis-epi-catch-up';
const APP_CONFIG_KEY = 'config';
const APP_DATA_STORE = `dataStore/${APP_NAMESPACE_KEY}/${APP_CONFIG_KEY}`;

const query = {
    store: {
        resource: APP_DATA_STORE,
    },
};

const create = {
    resource: APP_DATA_STORE,
    type: 'create',
    data: {},
};

const mutation = {
    resource: APP_DATA_STORE,
    type: 'update',
    data: variables => variables,
};

export const isValidAppConfig = appConfig => {
    return (
        appConfig?.immunizationIndicatorGroup &&
        appConfig?.immunizationDataGroup
    );
};

export const AppConfigProvider = ({ children }) => {
    const forceConfigApp = window.location.href.includes('configureApp');
    const { loading, error, data, refetch } = useDataQuery(query);

    const [initialize] = useDataMutation(create);

    const [mutate] = useDataMutation(mutation, {
        onComplete: () => {
            console.log('App config mutation completed');
            refetch().then(() => {
                console.log('App config refetched');
            });
        },
    });

    useEffect(() => {
        // Ensure to have one config entry to allow mutation (PUT)
        if (!loading && !data) {
            initialize().then(() => {
                console.log('App config initialized');
            });
        }
    }, [loading, data, initialize]);

    return (
        <ConfigContext.Provider
            value={{ loading, error, appConfig: data?.store, refetch, mutate }}
        >
            {forceConfigApp || !isValidAppConfig(data?.store) ? (
                <ConfigApp />
            ) : (
                children
            )}
        </ConfigContext.Provider>
    );
};
