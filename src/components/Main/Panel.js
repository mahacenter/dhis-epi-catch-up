import { Card } from '@dhis2/ui-core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider'; // TODO: Change when in core
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Adjust, Texture } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import _ from 'lodash';
import moment from 'moment';
import React, { useCallback, useContext, useReducer, useState } from 'react';
import { generateMarks } from '../../js/generateMarks';
import { periods, periodsRange } from '../../periods';
import { EagerMap } from '../EagerMap';
import { IndicatorSelector } from '../IndicatorSelector';
import { EagerAdminAreaSelector } from '../EagerAdminAreaSelector';
import Legend from '../legend/Legend';
import { getAutomaticLegendItems } from '../../util/legend';
import { LegendSelector } from '../LegendSelector';
import { Classification } from '../classification/Classification';
import { CLASSIFICATION_EQUAL_INTERVALS } from '../../constants/layers';
import { TimeFrame } from '../TimeFrame';
import { dataElementObject, dataObject, indexValueByName } from '../../js/api';
import { EagerChart } from '../EagerChart';
import {
    customIndicatorById,
    customLegendById,
} from '../../js/customIndicators';
import { TabPanel } from '../TabPanel';
import { CircleLegendEdition } from '../legend/CircleLegendEdition';
import { EagerCircleLegend } from '../legend/EagerCircleLegend';
import { ReactComponent as MahaBlack } from '../../images/MahaBlack.svg';
import { IndicatorsContext } from '../../context/IndicatorsContext';
import { CalendarGraphs } from '../calendar/CalendarGraphs';
import './style.css';
import { ExportButton } from '../ExportButton';

const isLegendAuto = legend => legend === 'auto';

var current = {};
_.each(periods, (v, k) => (current[k] = moment().format(v.currentFormat)));

export const Panel = () => {
    const data = useContext(IndicatorsContext);
    console.log('Panel', data.indicatorGroups);
    var previousApiPeriod = '201901';

    const defaultIndicatorGroup = data.indicatorGroups.indicatorGroups[0]?.id;
    const defaultIndicator =
        data.indicatorGroups.indicatorGroups[0]?.indicators[0].id;
    const defaultLegend = data.indicatorGroups.indicatorGroups[0]?.indicators[0]
        .legendSet
        ? data.indicatorGroups.indicatorGroups[0].indicators[0].legendSet.id
        : 'auto';
    const defaultOrganisationUnitLevel =
        data.organisationUnitLevels.organisationUnitLevels[1].level;

    const [indicatorGroup, setIndicatorGroup] = useState(defaultIndicatorGroup);
    const [indicator, setIndicator] = useState(defaultIndicator);
    const [organisationUnitLevel, setOrganisationUnitLevel] = useState(
        defaultOrganisationUnitLevel
    );
    const [legend, setLegend] = useState(defaultLegend);
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedAreaName, setSelectedAreaName] = useState('');

    const [history, setHistory] = useState(1);
    const [isCoverageLayerEnabled, setCoverageLayerEnabled] = useState(true);
    const [coverageLayerOpacity, toggleCoverageLayerOpacity] = useState(0.9);
    const [autoClassificationMethod, setAutoClassificationMethod] = useState(
        CLASSIFICATION_EQUAL_INTERVALS
    );
    const [autoClassificationColorCount, setAutoClassificationColorCount] =
        useState(5);
    const [autoClassificationColorScale, setAutoClassificationColorScale] =
        useState();
    const [circleLegend, setCircleLegend] = useState({
        isEnabled: false,
        size: [5, 600],
        opacity: 0.7,
        strokeWidth: 1,
        color: { r: 200, g: 200, b: 200, a: 0.8 },
        stroke: { r: 0, g: 0, b: 0, a: 1 },
    });
    const [tabSelected, handleTabSelectedChange] = useState('rates');

    const [isCoverageRateDiffEnabled, setCoverageRateDiffEnabled] =
        useState(false);
    const [isCoverageRateCatchUpEnabled, setCoverageRateCatchUpEnabled] =
        useState(false);

    const [timeScale, setTimeScale] = useState([]);

    const timeFrameChanged = timeFrame => {
        setTimeScale(periodsRange(timeFrame.periodType, timeFrame));
    };

    const rectifySliderPosition = sliderTest => {
        if (sliderTest) {
            return history;
        }

        const testPeriod = timeScale.filter(o => o.value === previousApiPeriod);
        if (testPeriod.length > 0) {
            return (
                _.findIndex(timeScale, o => o.value === previousApiPeriod) + 1
            );
        }

        return timeScale.length - 1;
    };

    const generateCurrentIndicator = () => {
        const currentGroup = data.indicatorGroups.indicatorGroups.filter(
            o => o.id === indicatorGroup
        )[0];
        return currentGroup.indicators.filter(o => o.id === indicator);
    };

    const getCustomLegend = () => customLegendById[legend];
    const isCustomLegend = () => Boolean(getCustomLegend());
    const isCustomIndicator = () => Boolean(customIndicatorById[indicator]);

    const generateLegendRef = (indicator, organisationUnitLevel) => {
        if (isCustomLegend()) {
            return { items: getCustomLegend().legendSet.legends };
        }

        if (!isLegendAuto(legend)) {
            const testRef = data.legendSets.legendSets.filter(
                o => o.id === legend
            );
            return {
                items: _.isEmpty(testRef)
                    ? []
                    : _.sortBy(testRef[0].legends, ['startValue']),
            };
        }

        if (!dataObject[indicator]) {
            dataObject[indicator] = {};
        }

        const values = [];
        _.each(dataObject[indicator][organisationUnitLevel], v => {
            if (v.rows) {
                _.each(v.rows, vv => {
                    values.push(_.toNumber(vv[2]));
                });
            }
        });
        const sortedValues = values.filter(_.isNumber).sort(function (a, b) {
            return a - b;
        });
        const autoLegend = getAutomaticLegendItems(
            sortedValues,
            autoClassificationMethod,
            autoClassificationColorScale
        );

        return { items: _.sortBy(autoLegend, ['startValue']) };
    };

    const generateCircleLegendRef = organisationUnitLevel => {
        const dataElementId =
            circleLegend.dataElement && circleLegend.dataElement.id;

        if (!dataElementId) {
            return;
        }
        if (!dataElementObject[dataElementId]) {
            dataElementObject[dataElementId] = {};
        }
        if (!dataElementObject[dataElementId][organisationUnitLevel]) {
            dataElementObject[dataElementId][organisationUnitLevel] = {};
        }

        let max, min;
        _.each(
            dataElementObject[dataElementId][organisationUnitLevel],
            (data, period) => {
                const nameToIndex = indexValueByName(data.headers);
                // check if contains min or max values
                data.rows.forEach(row => {
                    const circleValue = _.toNumber(row[nameToIndex['value']]);
                    if (!min) min = circleValue;
                    if (!max) max = circleValue;
                    if (circleValue < min) min = circleValue;
                    if (circleValue > max) max = circleValue;
                });
            }
        );

        return {
            min,
            max,
        };
    };

    function legendRefsReducer(state, action) {
        if (action === 'needsRefresh') {
            return { ...state, needsRefresh: true };
        }
        if (action === 'forceRefresh') {
            return {
                ...state,
                needsRefresh: false,
                legendRef: generateLegendRef(indicator, organisationUnitLevel),
            };
        }
        if (action === 'forceRefreshCircle') {
            return {
                ...state,
                circleLegendRef: generateCircleLegendRef(organisationUnitLevel),
            };
        }
        return state;
    }

    const [legendRefsState, dispatch] = useReducer(
        legendRefsReducer,
        {
            needsRefresh: false,
        },
        init => ({
            ...init,
            legendRef: generateLegendRef(indicator, organisationUnitLevel),
            circleLegendRef: generateCircleLegendRef(organisationUnitLevel),
        })
    );

    const circleLegendIsReadyCallback = useCallback(() => {
        dispatch('forceRefreshCircle');
    }, []);

    const mapIsReadyCallback = useCallback(() => {
        // EagerMap is ready, then the data is available to generate the auto legend
        if (isLegendAuto(legend)) {
            dispatch('forceRefresh');
        }
    }, [legend]);

    if (!data || !indicatorGroup) return <span>No data...</span>;

    const sliderTest = history <= timeScale.length;
    const sliderPos = rectifySliderPosition(sliderTest);
    const currentPeriod = timeScale[sliderPos - 1] || { label: '', value: '' };
    previousApiPeriod = currentPeriod.value;
    const apiPeriod = currentPeriod.value;
    const currentIndicator = generateCurrentIndicator();
    const currentIndicatorName =
        currentIndicator.length > 0 ? currentIndicator[0].name : '';

    return (
        <main id='main'>
            <div id='grid-root'>
                <Grid direction='row' container spacing={3}>
                    <Grid item xs={3}>
                        <Card className='padded-card controls-card'>
                            <Box component='div' display='block' mb={2}>
                                <span>
                                    <b>EPI catch-up app</b> |{' '}
                                    {data.me.displayName}
                                </span>
                            </Box>
                            <Box component='div' display='block'>
                                <FormControl>
                                    <InputLabel>Health program</InputLabel>
                                    <Select
                                        defaultValue={
                                            data.indicatorGroups
                                                .indicatorGroups[0].id
                                        }
                                        onChange={evt => {
                                            setIndicatorGroup(evt.target.value);
                                            dispatch('needsRefresh');
                                        }}
                                    >
                                        {data.indicatorGroups.indicatorGroups.map(
                                            (dt, i) => {
                                                return (
                                                    <MenuItem
                                                        value={dt.id}
                                                        key={i}
                                                        name={dt.name}
                                                    >
                                                        {dt.name}
                                                    </MenuItem>
                                                );
                                            }
                                        )}
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <InputLabel>Organisation unit</InputLabel>
                                    <Select
                                        value={organisationUnitLevel}
                                        onChange={evt => {
                                            setOrganisationUnitLevel(
                                                evt.target.value
                                            );
                                            setSelectedArea('');
                                            dispatch('needsRefresh');
                                        }}
                                    >
                                        {data.organisationUnitLevels.organisationUnitLevels
                                            .filter(o => {
                                                return (
                                                    o.name !== 'Facility' &&
                                                    o.level !== 1
                                                );
                                            })
                                            .map((dt, i) => {
                                                return (
                                                    <MenuItem
                                                        value={dt.level}
                                                        key={i}
                                                        name={dt.name}
                                                    >
                                                        {dt.name}
                                                    </MenuItem>
                                                );
                                            })}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Tabs
                                variant='fullWidth'
                                value={tabSelected}
                                indicatorColor='primary'
                                textColor='primary'
                                onChange={(event, value) =>
                                    handleTabSelectedChange(value)
                                }
                            >
                                <Tab
                                    label={
                                        <Box display='flex' alignItems='center'>
                                            <Texture /> Rates
                                        </Box>
                                    }
                                    value='rates'
                                />
                                <Tab
                                    label={
                                        <Box display='flex' alignItems='center'>
                                            <Adjust /> Absolute figures
                                        </Box>
                                    }
                                    value='absolutes'
                                />
                            </Tabs>
                            <TabPanel value={tabSelected} index='rates'>
                                <Box display='flex' alignItems='center'>
                                    <Box mr={3}>Enable</Box>
                                    <Checkbox
                                        onChange={() =>
                                            setCoverageLayerEnabled(
                                                !isCoverageLayerEnabled
                                            )
                                        }
                                        checked={isCoverageLayerEnabled}
                                        color='primary'
                                        inputProps={{
                                            'aria-label': 'secondary checkbox',
                                        }}
                                    />
                                </Box>
                                {isCoverageLayerEnabled && (
                                    <>
                                        <Divider />
                                        <FormControl>
                                            <Box
                                                display='flex'
                                                alignItems='center'
                                                mt={2}
                                            >
                                                <Box
                                                    mr={3}
                                                    className='xs-hidden'
                                                >
                                                    Opacity
                                                </Box>
                                                <Box mr={3}>
                                                    <VisibilityOffIcon
                                                        opacity={0.6}
                                                    />
                                                </Box>
                                                <Slider
                                                    value={coverageLayerOpacity}
                                                    min={0}
                                                    max={1}
                                                    step={0.1}
                                                    onChange={(event, value) =>
                                                        toggleCoverageLayerOpacity(
                                                            value
                                                        )
                                                    }
                                                    valueLabelDisplay='auto'
                                                />
                                                <Box ml={3}>
                                                    <VisibilityIcon
                                                        opacity={0.6}
                                                    />
                                                </Box>
                                            </Box>
                                        </FormControl>
                                        <Box component='div' display='block'>
                                            <IndicatorSelector
                                                indicator={indicator}
                                                group={indicatorGroup}
                                                groups={
                                                    data.indicatorGroups
                                                        .indicatorGroups
                                                }
                                                onChange={indicator => {
                                                    setIndicator(indicator);
                                                    dispatch('needsRefresh');
                                                }}
                                            />
                                        </Box>
                                        <Box component='div' display='block'>
                                            <LegendSelector
                                                allowAutoLegend={
                                                    !isCustomIndicator()
                                                }
                                                legend={legend}
                                                legendSets={
                                                    data.legendSets.legendSets
                                                }
                                                indicator={indicator}
                                                group={indicatorGroup}
                                                groups={
                                                    data.indicatorGroups
                                                        .indicatorGroups
                                                }
                                                onChange={value => {
                                                    if (value !== legend) {
                                                        setLegend(value);
                                                        dispatch(
                                                            'forceRefresh'
                                                        );
                                                    }
                                                }}
                                            />
                                        </Box>
                                        {isLegendAuto(legend) && (
                                            <Box
                                                component='div'
                                                display='block'
                                            >
                                                {legendRefsState.needsRefresh && (
                                                    <IconButton
                                                        className='refresh-legend-button'
                                                        onClick={() =>
                                                            dispatch(
                                                                'forceRefresh'
                                                            )
                                                        }
                                                    >
                                                        <RefreshIcon />
                                                        Recalculate legend
                                                    </IconButton>
                                                )}
                                                <Classification
                                                    classes={
                                                        autoClassificationColorCount
                                                    }
                                                    method={
                                                        autoClassificationMethod
                                                    }
                                                    colorScale={
                                                        autoClassificationColorScale
                                                    }
                                                    setClassification={value => {
                                                        setAutoClassificationMethod(
                                                            value
                                                        );
                                                        dispatch(
                                                            'forceRefresh'
                                                        );
                                                    }}
                                                    setColorScale={value => {
                                                        setAutoClassificationColorScale(
                                                            value
                                                        );
                                                        setAutoClassificationColorCount(
                                                            value.split(',')
                                                                .length
                                                        );
                                                        dispatch(
                                                            'forceRefresh'
                                                        );
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </>
                                )}
                            </TabPanel>
                            <TabPanel value={tabSelected} index='absolutes'>
                                <CircleLegendEdition
                                    legend={circleLegend}
                                    onChange={value => setCircleLegend(value)}
                                />
                            </TabPanel>
                            <Box mt={2}>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Box
                                            display='flex'
                                            flexDirection='column'
                                        >
                                            <span
                                                style={{
                                                    color: 'red',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                New indicators for catch-up
                                                campaigns
                                            </span>
                                            <span>
                                                Select the indicators so to
                                                activate the innovative
                                                visualizations, which are
                                                displayed below the bar graphs
                                            </span>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <FormGroup>
                                            <FormControlLabel
                                                label='Coverage rate difference 2019/2020'
                                                control={
                                                    <Checkbox
                                                        onChange={() =>
                                                            setCoverageRateDiffEnabled(
                                                                !isCoverageRateDiffEnabled
                                                            )
                                                        }
                                                        checked={
                                                            isCoverageRateDiffEnabled
                                                        }
                                                        color='primary'
                                                    />
                                                }
                                            />
                                            {isCoverageRateDiffEnabled && (
                                                <FormControlLabel
                                                    label='Coverage rate catch-up trend'
                                                    control={
                                                        <Checkbox
                                                            onChange={() =>
                                                                setCoverageRateCatchUpEnabled(
                                                                    !isCoverageRateCatchUpEnabled
                                                                )
                                                            }
                                                            checked={
                                                                isCoverageRateCatchUpEnabled
                                                            }
                                                            color='primary'
                                                        />
                                                    }
                                                />
                                            )}
                                        </FormGroup>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={9}>
                        <Card className='padded-card'>
                            <Box display='flex'>
                                <TimeFrame
                                    onChange={value => {
                                        timeFrameChanged(value);
                                        dispatch('needsRefresh');
                                    }}
                                />
                                <MahaBlack className='maha-logo' />
                            </Box>
                            <Grid
                                container
                                className={'in-line-container'}
                                spacing={3}
                            >
                                <IconButton
                                    className={'in-line-first'}
                                    aria-label='previous-period'
                                    onClick={() => {
                                        if (history > 1) {
                                            setHistory(history - 1);
                                        }
                                    }}
                                >
                                    <NavigateBeforeIcon />
                                </IconButton>
                                <Slider
                                    value={
                                        sliderTest === true
                                            ? history
                                            : sliderPos
                                    }
                                    min={1}
                                    max={timeScale.length}
                                    valueLabelDisplay='auto'
                                    track={false}
                                    valueLabelFormat={value =>
                                        timeScale[value - 1] &&
                                        timeScale[value - 1].label
                                    }
                                    marks={generateMarks(timeScale)}
                                    onChange={(evt, history) => {
                                        setHistory(history);
                                    }}
                                />
                                <IconButton
                                    className={'in-line-last'}
                                    aria-label='next-period'
                                    onClick={() => {
                                        if (history < timeScale.length) {
                                            setHistory(history + 1);
                                        }
                                    }}
                                >
                                    <NavigateNextIcon />
                                </IconButton>
                            </Grid>
                            <Grid
                                id='main-map'
                                direction='row'
                                container
                                spacing={3}
                            >
                                <Grid item xs={3}>
                                    <div className='layer-card'>
                                        <Box display='flex' alignItems='center'>
                                            <Box flexGrow={1}>
                                                {currentPeriod.label}
                                            </Box>
                                            <ExportButton
                                                id='main-map'
                                                title='Export this map'
                                                filename={`${currentIndicatorName} - ${currentPeriod.label}`}
                                            />
                                        </Box>
                                        <Box mb='5px'>
                                            <EagerAdminAreaSelector
                                                ouLevel={organisationUnitLevel}
                                                selectedArea={selectedArea}
                                                onChange={(selected, name) => {
                                                    setSelectedArea(selected);
                                                    setSelectedAreaName(name);
                                                }}
                                            />
                                        </Box>
                                        <Box>
                                            <Typography gutterBottom>
                                                {currentIndicatorName}
                                            </Typography>
                                            <Divider />
                                            <Box mt={1}>
                                                <CardContent
                                                    className='layer-card-content'
                                                    style={{ padding: 0 }}
                                                >
                                                    <div className='layer-card-legend'>
                                                        <Legend
                                                            {...legendRefsState.legendRef}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Box>
                                        </Box>
                                        {circleLegend.isEnabled && (
                                            <EagerCircleLegend
                                                circleLegend={circleLegend}
                                                circleLegendRef={
                                                    legendRefsState.circleLegendRef
                                                }
                                                timeScale={timeScale}
                                                ouLevel={organisationUnitLevel}
                                                isReady={
                                                    circleLegendIsReadyCallback
                                                }
                                            />
                                        )}
                                    </div>
                                </Grid>
                                <Grid item xs={9}>
                                    <EagerMap
                                        ouLevel={organisationUnitLevel}
                                        historyPosition={apiPeriod}
                                        dx={indicator}
                                        legendRef={legendRefsState.legendRef}
                                        circleLegendRef={
                                            legendRefsState.circleLegendRef
                                        }
                                        isCoverageLayerEnabled={
                                            isCoverageLayerEnabled
                                        }
                                        coverageLayerOpacity={
                                            coverageLayerOpacity
                                        }
                                        onSelection={(selected, name) => {
                                            setSelectedArea(selected);
                                            setSelectedAreaName(name);
                                        }}
                                        selectedArea={selectedArea}
                                        timeScale={timeScale}
                                        legend={legend}
                                        circleLegend={circleLegend}
                                        isReady={mapIsReadyCallback}
                                    />
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>

                {!isCustomIndicator() && (
                    <Grid direction='row' container spacing={2}>
                        <Grid item xs={6}>
                            <Card className='padded-card'>
                                <div>
                                    <EagerChart
                                        ouLevel={
                                            data.organisationUnitLevels
                                                .organisationUnitLevels[0].level
                                        }
                                        ou={
                                            data.nationalUnits
                                                .organisationUnits[0].id
                                        }
                                        dx={indicator}
                                        title={`${data.nationalUnits.organisationUnits[0].name} - ${currentIndicator[0].name}`}
                                        timeScale={timeScale}
                                        circleLegend={circleLegend}
                                    />
                                </div>
                            </Card>
                        </Grid>
                        {selectedArea && selectedArea !== '' && (
                            <Grid item xs={6}>
                                <Card className='padded-card'>
                                    <div>
                                        <EagerChart
                                            ouLevel={organisationUnitLevel}
                                            ou={selectedArea}
                                            dx={indicator}
                                            title={`${selectedAreaName} - ${currentIndicator[0].name}`}
                                            timeScale={timeScale}
                                            circleLegend={circleLegend}
                                        />
                                    </div>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                )}

                {isCoverageRateDiffEnabled && (
                    <CalendarGraphs
                        isCoverageRateCatchUpEnabled={
                            isCoverageRateCatchUpEnabled
                        }
                    />
                )}
            </div>
        </main>
    );
};
