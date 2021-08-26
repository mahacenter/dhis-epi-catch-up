import React from 'react';
import { CircularLoader } from '@dhis2/ui-core';
import { useDataQuery } from '@dhis2/app-runtime';
import { Field, SingleSelect, SingleSelectOption } from '@dhis2/ui';

const query = {
    req: {
        resource: 'indicatorGroups',
        params: {
            fields: 'id,displayName',
            order: 'displayName:asc',
            pageSize: 1000,
        },
    },
};

export function ImmunizationIndicatorGroupSelector({ onChange, value }) {
    const { loading, data } = useDataQuery(query);

    if (loading || !data?.req) {
        return <CircularLoader />;
    }
    const { indicatorGroups } = data.req;

    return (
        <Field label='Selection of the immunization indicator group'>
            <SingleSelect
                selected={value || ''}
                onChange={evt => onChange(evt.selected)}
            >
                {indicatorGroups.map(indicator => (
                    <SingleSelectOption
                        value={indicator.id}
                        key={indicator.id}
                        label={indicator.displayName}
                    />
                ))}
            </SingleSelect>
        </Field>
    );
}
