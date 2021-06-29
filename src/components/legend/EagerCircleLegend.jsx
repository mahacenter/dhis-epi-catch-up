import React, {useEffect, useState} from 'react'
import {CircularLoader} from '@dhis2/ui-core'
import {getDataElement} from './../../js/api'
import {CircleLegend} from "./CircleLegend";

export const EagerCircleLegend = props => {
    const {isReady, circleLegendRef, circleLegend, ouLevel, timeScale} = props;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const periods = timeScale.map(period => getDataElement({
            dataElement: circleLegend.dataElement.id,
            ouLevel: ouLevel,
            period: period.value,
        }))
        Promise.all(periods).then(() => {
            setIsLoading(false)
            isReady();
        })
    }, [circleLegend.dataElement.id, ouLevel, timeScale, isReady])

    if (isLoading || !circleLegendRef) {
        return (
            <div>
                <CircularLoader />
            </div>
        )
    }
    return <CircleLegend {...props} />
}
