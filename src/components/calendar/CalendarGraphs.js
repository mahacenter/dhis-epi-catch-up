import React, {useContext, useState} from 'react'
import {Card} from "@dhis2/ui-core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import {ImmunizationSelector} from "../ImmunizationSelector";
import {CalendarGraph} from "./CalendarGraph";
import {DistrictSelector} from "../DistrictSelector";
import {IndicatorsContext} from "../../context/IndicatorsContext";
import {indicatorCatchUpSeries, mapToCalendarData, sumIndicatorNumerator} from "./mappers";
import {OU_LEVELS} from "../../js/customDhisVariables";
import {MultilineGraph} from "./MultilineGraph";
import {periodsRange} from "../../periods";
import {IndicatorsDataLoader} from "../IndicatorsDataLoader";
import {dataObject} from "../../js/api";
import {ChiefdomsSelector} from "../ChiefdomsSelector";
import {CalendarHelpButton} from "./CalendarHelpButton";
import {MultilineHelpButton} from "./MultilineHelpButton";

const timeScale = periodsRange('Monthly', {
    periodType: 'Monthly',
        startType: '01',
        startYear: 2019,
        endType: '12',
        endYear: 2020,
});

export function CalendarGraphs({isCoverageRateCatchUpEnabled}) {
    const [selectedIndicator, setIndicator] = useState();
    const [selectedDistrict, setDistrict] = useState();
    const [selectedChiefdoms, setChiefdoms] = useState();
    const {districtUnits} = useContext(IndicatorsContext);

    return (
        <Grid direction="row" container spacing={2}>
            <Grid item xs={12}>
                <Card className="padded-card">
                    <Box display="flex" alignItems="center">
                        <b>Coverage rate difference 2019/2020</b>
                        <Box ml={1} mr={2}> - Display "Calendar view" </Box>
                        <CalendarHelpButton />
                    </Box>
                    <Grid direction="row" container spacing={2} alignItems="center">
                        <Grid item xs={3}>
                            <ImmunizationSelector
                                onChange={setIndicator}/>
                        </Grid>
                        <Grid item xs={3}>
                            <DistrictSelector
                                onChange={setDistrict}/>
                        </Grid>
                        <Grid item xs={3}>
                            <ChiefdomsSelector
                                district={selectedDistrict}
                                onChange={setChiefdoms}/>
                        </Grid>
                    </Grid>
                    <Grid>
                        <small>Select the question mark to get access to the definition and interpretation</small>
                    </Grid>
                    <Grid direction="row" container spacing={2}>
                        { selectedIndicator &&
                            <Grid item xs={6}>
                                <IndicatorsDataLoader
                                    indicators={[selectedIndicator]}
                                    dataElements={[]}
                                    ouLevel={OU_LEVELS.DISTRICT}
                                    timeScale={timeScale}
                                    component={() => {
                                        return <CalendarGraph
                                            name="districts"
                                            indicator={selectedIndicator}
                                            organisationUnits={districtUnits.organisationUnits}
                                            years={mapToCalendarData(
                                                dataObject[selectedIndicator?.id]?.[OU_LEVELS.DISTRICT],
                                                districtUnits.organisationUnits,
                                                timeScale
                                            )}
                                            cumulated={sumIndicatorNumerator(
                                                dataObject[selectedIndicator?.id]?.[OU_LEVELS.DISTRICT],
                                                districtUnits.organisationUnits,
                                                timeScale,
                                                new Date('2020-12-01'),
                                            )}/>;
                                    }}/>
                            </Grid>
                        }
                        { selectedIndicator && selectedDistrict &&
                            <Grid item xs={6}>
                                <IndicatorsDataLoader
                                    indicators={[selectedIndicator]}
                                    dataElements={[]}
                                    ouLevel={OU_LEVELS.CHIEFDOM}
                                    timeScale={timeScale}
                                    component={() => {
                                        return <CalendarGraph
                                            name={selectedDistrict.name}
                                            indicator={selectedIndicator}
                                            organisationUnits={selectedChiefdoms}
                                            years={mapToCalendarData(
                                                dataObject[selectedIndicator?.id]?.[OU_LEVELS.CHIEFDOM],
                                                selectedChiefdoms,
                                                timeScale
                                            )}
                                            cumulated={sumIndicatorNumerator(
                                                dataObject[selectedIndicator?.id]?.[OU_LEVELS.CHIEFDOM],
                                                selectedChiefdoms,
                                                timeScale,
                                                new Date('2020-12-01'),
                                            )}/>;
                                    }}/>
                            </Grid>
                        }
                    </Grid>
                    {isCoverageRateCatchUpEnabled && <>
                        <Box display="flex" alignItems="center">
                            <b>Coverage rate catch-up trend: Proxy</b>
                            <Box ml={1} mr={2}> - Display "Multi-line" </Box>
                            <MultilineHelpButton />
                        </Box>
                        <Grid direction="row">
                            <small>Select the question mark to get access to the definition and interpretation</small>
                        </Grid>
                        <Grid direction="row" container spacing={2} alignItems="center">
                            <Grid item xs={6}>
                            </Grid>

                            {selectedIndicator && selectedDistrict &&
                            <Grid item xs={6}>
                                <IndicatorsDataLoader
                                    indicators={[selectedIndicator]}
                                    dataElements={[]}
                                    ouLevel={OU_LEVELS.CHIEFDOM}
                                    timeScale={timeScale}
                                    component={() => {
                                        return <MultilineGraph
                                            organisationUnits={selectedChiefdoms}
                                            periods={timeScale}
                                            series={indicatorCatchUpSeries(
                                                dataObject[selectedIndicator?.id]?.[OU_LEVELS.CHIEFDOM],
                                                selectedChiefdoms,
                                                timeScale,
                                            )}
                                        />;
                                    }}/>
                            </Grid>
                            }
                        </Grid>
                    </>}
                </Card>
            </Grid>
        </Grid>
    );
}
