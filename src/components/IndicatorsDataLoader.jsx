import React, {useEffect, useState} from 'react';
import {CircularLoader} from "@dhis2/ui-core";
import {getIndicatorData} from './../js/api';
import {getDataElement} from "../js/api";
import {useConfig} from "@dhis2/app-runtime";

export const IndicatorsDataLoader = props => {
    const {indicators, dataElements = [], ouLevel, timeScale, isReady, component} = props;
    const [isLoading, setIsLoading] = useState(true);
    const config = useConfig();

    useEffect(() => {
        setIsLoading(true);
        const fetchIndicatorsData = period => {
            return Promise.all(indicators.map(indicator => getIndicatorData(config, {
                indicator: indicator.id,
                ouLevel: ouLevel,
                period: period.value,
            })));
        };
        const fetchDataElements = period => {
            return Promise.all(dataElements.map(dataElement => getDataElement(config, {
                dataElement: dataElement.id,
                ouLevel: ouLevel,
                period: period.value,
            })));
        };
        const getData = period => {
            return Promise.all([
                fetchIndicatorsData(period),
                fetchDataElements(period),
            ]);
        };
        Promise.all(timeScale.map(getData)).then(() => {
            setIsLoading(false);
            isReady && isReady();
        });
    }, [indicators, dataElements, ouLevel, timeScale, isReady]);

    if (isLoading) {
        return <CircularLoader />;
    }

    return component({...props, isLoading});
}
