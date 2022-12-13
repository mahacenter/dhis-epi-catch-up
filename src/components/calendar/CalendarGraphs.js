import { Card } from '@dhis2/ui-core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import React, { useContext, useState } from 'react';
import { lastYear } from '../../constants/periods';
import { IndicatorsContext } from '../../context/IndicatorsContext';
import { dataObject } from '../../js/api';
import { OU_LEVELS } from '../../js/customDhisVariables';
import { periodsRange } from '../../periods';
import { ChiefdomsSelector } from '../ChiefdomsSelector';
import {DateSelector} from "../DateSelector";
import { DistrictSelector } from '../DistrictSelector';
import { ImmunizationSelector } from '../ImmunizationSelector';
import { IndicatorsDataLoader } from '../IndicatorsDataLoader';
import { CalendarGraph } from './CalendarGraph';
import { CalendarHelpButton } from './CalendarHelpButton';
import {
    indicatorCatchUpSeries,
    mapToCalendarData,
    sumIndicatorNumerator,
} from './mappers';
import { MultilineGraph } from './MultilineGraph';
import { MultilineHelpButton } from './MultilineHelpButton';

const timeScaleForYear = year => periodsRange('Monthly', {
    periodType: 'Monthly',
    startType: '01',
    startYear: year - 1,
    endType: '12',
    endYear: year,
});

export function CalendarGraphs({ isCoverageRateCatchUpEnabled }) {
    const [selectedDate, setSelectedDate] = useState(new Date().getFullYear());
    const [selectedIndicator, setIndicator] = useState();
    const [selectedDistrict, setDistrict] = useState();
    const [selectedChiefdoms, setChiefdoms] = useState();
    const { districtUnits } = useContext(IndicatorsContext);
    const timeScale = timeScaleForYear(selectedDate);

    return (
        <Grid direction='row' container spacing={2}>
            <Grid item xs={12}>
                <Card className='padded-card'>
                    <Box display='flex' alignItems='center'>
                        <b>Coverage rate difference</b>
                        <Box ml={1} mr={2}>
                            {' '}
                            - Display "Calendar view"{' '}
                        </Box>
                        <CalendarHelpButton />
                    </Box>
                    <Grid
                        direction='row'
                        container
                        spacing={2}
                        alignItems='center'
                    >
                        <Grid item xs={3}>
                            <DateSelector onChange={setSelectedDate} />
                        </Grid>
                        <Grid item xs={3}>
                            <ImmunizationSelector onChange={setIndicator} />
                        </Grid>
                        <Grid item xs={3}>
                            <DistrictSelector onChange={setDistrict} />
                        </Grid>
                        <Grid item xs={3}>
                            <ChiefdomsSelector
                                district={selectedDistrict}
                                onChange={setChiefdoms}
                            />
                        </Grid>
                    </Grid>
                    <Grid>
                        <small>
                            Select the question mark to get access to the
                            definition and interpretation
                        </small>
                    </Grid>
                    <Grid direction='row' container spacing={2}>
                        {selectedIndicator && (
                            <Grid item xs={6}>
                                <IndicatorsDataLoader
                                    indicators={[selectedIndicator]}
                                    dataElements={[]}
                                    ouLevel={OU_LEVELS.DISTRICT}
                                    timeScale={timeScale}
                                    component={() => {
                                        try {
                                            return (
                                                <CalendarGraph
                                                    name='districts'
                                                    indicator={selectedIndicator}
                                                    organisationUnits={
                                                        districtUnits.organisationUnits
                                                    }
                                                    years={mapToCalendarData(
                                                        dataObject[
                                                            selectedIndicator?.id
                                                            ]?.[OU_LEVELS.DISTRICT],
                                                        districtUnits.organisationUnits,
                                                        timeScale
                                                    )}
                                                    cumulated={sumIndicatorNumerator(
                                                        dataObject[
                                                            selectedIndicator?.id
                                                            ]?.[OU_LEVELS.DISTRICT],
                                                        districtUnits.organisationUnits,
                                                        timeScale,
                                                        new Date(
                                                            `${selectedDate}-12-01`
                                                        )
                                                    )}
                                                />
                                            );
                                        } catch (e) {
                                            return null
                                        }
                                    }}
                                />
                            </Grid>
                        )}
                        {selectedIndicator && selectedDistrict && (
                            <Grid item xs={6}>
                                <IndicatorsDataLoader
                                    indicators={[selectedIndicator]}
                                    dataElements={[]}
                                    ouLevel={OU_LEVELS.CHIEFDOM}
                                    timeScale={timeScale}
                                    component={() => {
                                        try {
                                            return (
                                                <CalendarGraph
                                                    name={selectedDistrict.name}
                                                    indicator={selectedIndicator}
                                                    organisationUnits={
                                                        selectedChiefdoms
                                                    }
                                                    years={mapToCalendarData(
                                                        dataObject[
                                                            selectedIndicator?.id
                                                            ]?.[OU_LEVELS.CHIEFDOM],
                                                        selectedChiefdoms,
                                                        timeScale
                                                    )}
                                                    cumulated={sumIndicatorNumerator(
                                                        dataObject[
                                                            selectedIndicator?.id
                                                            ]?.[OU_LEVELS.CHIEFDOM],
                                                        selectedChiefdoms,
                                                        timeScale,
                                                        new Date(
                                                            `${selectedDate}-12-01`
                                                        )
                                                    )}
                                                />
                                            );
                                        } catch (e) {
                                            return null
                                        }
                                    }}
                                />
                            </Grid>
                        )}
                    </Grid>
                    {isCoverageRateCatchUpEnabled && (
                        <>
                            <Box display='flex' alignItems='center'>
                                <b>Coverage rate catch-up trend: Proxy</b>
                                <Box ml={1} mr={2}>
                                    {' '}
                                    - Display "Multi-line"{' '}
                                </Box>
                                <MultilineHelpButton />
                            </Box>
                            <Grid direction='row'>
                                <small>
                                    Select the question mark to get access to
                                    the definition and interpretation
                                </small>
                            </Grid>
                            <Grid
                                direction='row'
                                container
                                spacing={2}
                                alignItems='center'
                            >
                                <Grid item xs={6}></Grid>

                                {selectedIndicator && selectedDistrict && (
                                    <Grid item xs={6}>
                                        <IndicatorsDataLoader
                                            indicators={[selectedIndicator]}
                                            dataElements={[]}
                                            ouLevel={OU_LEVELS.CHIEFDOM}
                                            timeScale={timeScale}
                                            component={() => {
                                                return (
                                                    <MultilineGraph
                                                        organisationUnits={
                                                            selectedChiefdoms
                                                        }
                                                        periods={timeScale}
                                                        series={indicatorCatchUpSeries(
                                                            dataObject[
                                                                selectedIndicator
                                                                    ?.id
                                                            ]?.[
                                                                OU_LEVELS
                                                                    .CHIEFDOM
                                                            ],
                                                            selectedChiefdoms,
                                                            timeScale
                                                        )}
                                                    />
                                                );
                                            }}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </>
                    )}
                </Card>
            </Grid>
        </Grid>
    );
}
