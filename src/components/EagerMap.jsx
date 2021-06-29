import React, {useEffect, useState} from 'react'
import {CircularLoader} from '@dhis2/ui-core'
import {Map} from './Map'
import {getIndicatorData} from './../js/api'

export const EagerMap = props => {
    const {timeScale, ouLevel, isReady, dx} = props;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getData = period => {
            return getIndicatorData({
                indicator: dx,
                ouLevel: ouLevel,
                period: period.value,
            })
        };
        Promise.all(timeScale.map(getData)).then(() => {
            setIsLoading(false)
            isReady();
        });
    }, [dx, ouLevel, timeScale, isReady]);

    if (isLoading) {
        return (
            <div>
                <CircularLoader />
            </div>
        )
    }
    return <Map {...props} />
}
