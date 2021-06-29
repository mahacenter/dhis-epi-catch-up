import React, { useState, useEffect } from 'react'
import { CircularLoader } from '@dhis2/ui-core'
import { AdminAreaSelector } from './AdminAreaSelector'
import { getDataObject, getOrgUnitList } from './../js/api'

export const EagerAdminAreaSelector = props => {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        getOrgUnitList({level: props.ouLevel}).then(() => {
            setIsLoading(false)
        })
    }, [props.ouLevel])

    if (isLoading || !getDataObject().orgUnitList[props.ouLevel]) {
        return (
            <div>
                <CircularLoader />
            </div>
        )
    }
    return <AdminAreaSelector {...props} />
}
