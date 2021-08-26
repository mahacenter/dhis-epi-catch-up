import { useDataQuery } from '@dhis2/app-runtime';
import { CircularLoader, Layer } from '@dhis2/ui-core';
import _ from 'lodash';
import React from 'react';
import { Panel } from './Panel';
import { IndicatorsContext } from '../../context/IndicatorsContext';
import {
    customIndicators,
    customIndicatorsByGroup,
} from '../../js/customIndicators';
import { OU_LEVELS } from '../../js/customDhisVariables';
import { CUSTOM_LEGENDS } from '../../js/customLegends';
import './style.css';
import { useAppConfig } from '../../config/config.context';

const query = {
    me: {
        resource: 'me',
        params: {
            fields: 'displayName',
        },
    },
    indicatorGroups: {
        resource: 'indicatorGroups',
        params: {
            fields: 'id,displayName~rename(name),indicators[id,displayName~rename(name),legendSet[id]]~order(name:asc)',
            order: 'displayName:asc',
            paging: 'false',
        },
    },
    nationalUnits: {
        resource: 'organisationUnits',
        params: {
            fields: 'id,name',
            paging: 'false',
            level: OU_LEVELS.COUNTRY,
        },
    },
    districtUnits: {
        resource: 'organisationUnits',
        params: {
            fields: 'id,name',
            paging: 'false',
            level: OU_LEVELS.DISTRICT,
        },
    },
    chiefdomUnits: {
        resource: 'organisationUnits',
        params: {
            fields: 'id,name,parent',
            paging: 'false',
            level: OU_LEVELS.CHIEFDOM,
        },
    },
    organisationUnitLevels: {
        resource: 'organisationUnitLevels',
        params: {
            // fields: 'id,displayName~rename(name),level',
            fields: ':all',
            order: 'level:asc',
            paging: 'false',
        },
    },
    legendSets: {
        resource: 'legendSets',
        params: {
            // fields: 'id,displayName~rename(name)',
            fields: ':all',
            paging: 'false',
        },
    },
};

function addCustomIndicators(group) {
    const customIndicators = customIndicatorsByGroup[group.id];
    if (_.isEmpty(customIndicators)) {
        return group;
    }
    return {
        ...group,
        indicators: [...group.indicators, ...customIndicators],
    };
}

function adaptGroupsToCustomer(appConfig, data) {
    console.log('Starting EPI Catch-up', { appConfig, data });
    return {
        ...data,
        indicatorGroups: {
            ...data.indicatorGroups,
            indicatorGroups: data.indicatorGroups.indicatorGroups
                .filter(
                    group => group.id === appConfig.immunizationIndicatorGroup
                )
                .map(group => addCustomIndicators(group)),
        },
        legendSets: {
            ...data.legendSets,
            legendSets: [
                ...data.legendSets.legendSets,
                ...CUSTOM_LEGENDS,
                ...customIndicators.map(indicator => indicator.legendSet),
            ],
        },
    };
}

export const Main = () => {
    const { loading, error, data } = useDataQuery(query);
    const { appConfig } = useAppConfig();

    if (loading || !data) {
        return (
            <Layer>
                <CircularLoader />
            </Layer>
        );
    }
    if (error) return <span>{error.message}</span>;

    return (
        <IndicatorsContext.Provider
            value={adaptGroupsToCustomer(appConfig, data)}
        >
            <Panel />
        </IndicatorsContext.Provider>
    );
};
