import React from 'react';
import { CircularLoader } from '@dhis2/ui-core';
import { useDataQuery } from '@dhis2/app-runtime';
import { Field, SingleSelect, SingleSelectOption } from '@dhis2/ui';

const query = {
    req: {
        resource: 'dataElementGroups',
        params: {
            fields: 'id,displayName',
            order: 'displayName:asc',
            pageSize: 1000,
        },
    },
};

export function ImmunizationDataGroupSelector({ onChange, value }) {
    const { loading, data } = useDataQuery(query);

    if (loading || !data?.req) {
        return <CircularLoader />;
    }
    const { dataElementGroups } = data.req;

    return (
        <Field label='Selection of the immunization data-element group'>
            <SingleSelect
                selected={value || ''}
                onChange={evt => onChange(evt.selected)}
            >
                {dataElementGroups.map(group => (
                    <SingleSelectOption
                        value={group.id}
                        key={group.id}
                        label={group.displayName}
                    />
                ))}
            </SingleSelect>
        </Field>
    );
}
