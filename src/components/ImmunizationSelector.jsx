import * as _ from 'lodash';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useContext, useEffect, useState } from 'react';
import { IndicatorsContext } from '../context/IndicatorsContext';
import { customIndicatorById } from '../js/customIndicators';
import { useAppConfig } from '../config/config.context';

const isRegularIndicator = indicator =>
    !Boolean(customIndicatorById[indicator.id]);

export function ImmunizationSelector({ onChange, ...props }) {
    const [selectedIndicator, setIndicator] = useState();
    const data = useContext(IndicatorsContext);
    const { appConfig } = useAppConfig();

    const immunizationGroup = data.indicatorGroups.indicatorGroups.find(
        group => group.id === appConfig.immunizationIndicatorGroup
    );
    const firstIndicator = immunizationGroup.indicators[0];
    const sortedIndicators = _.sortBy(
        immunizationGroup.indicators.filter(isRegularIndicator),
        indicator => indicator.name
    );

    useEffect(() => {
        setIndicator(firstIndicator);
        onChange(firstIndicator);
    }, [onChange, firstIndicator]);

    return (
        <FormControl>
            <InputLabel>Selection of the antigen</InputLabel>
            <Select
                value={selectedIndicator ? selectedIndicator.id : ''}
                onChange={evt => {
                    const indicator = immunizationGroup.indicators.find(
                        i => i.id === evt.target.value
                    );
                    setIndicator(indicator);
                    onChange(indicator);
                }}
            >
                <MenuItem value=''>
                    <em>None</em>
                </MenuItem>
                {sortedIndicators.map(indicator => (
                    <MenuItem
                        value={indicator.id}
                        key={indicator.id}
                        name={indicator.name}
                    >
                        {indicator.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
