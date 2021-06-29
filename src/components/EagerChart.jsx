import React, {useEffect, useState} from 'react'
import {CircularLoader} from '@dhis2/ui-core'
import * as _ from 'lodash'
import {Chart} from "./Chart";
import {getIndicatorData, getDataElement, mapDataElementResult} from "../js/api";

export const EagerChart = props => {
    const [areaPeriodsData, setAreaPeriodsData] = useState()
    const [absolutePeriodsData, setAbsolutePeriodsData] = useState()

    useEffect(() => {
        const fetchAreaPeriodsData = () => {
            setAreaPeriodsData(null);

            const periodsDataPromises = props.timeScale.map(period => getIndicatorData({
                indicator: props.dx,
                ouLevel: props.ouLevel,
                period: period.value,
            }));

            Promise.all(periodsDataPromises).then(result => setAreaPeriodsData(result));
        };

        const fetchAbsolutePeriodsData = () => {
            if (!props.circleLegend.isEnabled) {
                setAbsolutePeriodsData(null)
                return;
            } else {
                setAbsolutePeriodsData('loading');
            }

            const periodsDataPromises = props.timeScale.map(period => getDataElement({
                dataElement: props.circleLegend.dataElement.id,
                ouLevel: props.ouLevel,
                period: period.value,
            }).then(data => mapDataElementResult(period, data)));

            Promise.all(periodsDataPromises).then(result => {
                setAbsolutePeriodsData(_.keyBy(result, periodData => periodData.period));
            });
        };

        fetchAreaPeriodsData();
        fetchAbsolutePeriodsData();
    }, [props.dx, props.ouLevel, props.timeScale, props.circleLegend])

    if (!areaPeriodsData || absolutePeriodsData === 'loading') {
        return (
            <div>
                <CircularLoader />
            </div>
        )
    }
    return <Chart {...props} areaPeriodsData={areaPeriodsData} absolutePeriodsData={absolutePeriodsData}/>
}
