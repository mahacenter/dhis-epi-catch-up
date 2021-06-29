import _ from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Grid from '@material-ui/core/Grid'
import { periods } from '../periods'
import { checkEndPeriod } from '../js/checkEndPeriod'

var current = {}
_.each(periods, (v, k) => (current[k] = moment().format(v.currentFormat)))
export const TimeFrame = props => {
    const [periodType, setPeriodType] = useState('Monthly')
    const [startPeriodType, setStartPeriodType] = useState('01')
    const [startPeriodYear, setStartPeriodYear] = useState('2019')
    const [endPeriodType, setEndPeriodType] = useState(current['Monthly'])
    const [endPeriodYear, setEndPeriodYear] = useState(current['Yearly'])

    const emitTimeFrameChange = () =>
        props.onChange({
            periodType: periodType,
            startType: startPeriodType,
            startYear: startPeriodYear,
            endType: endPeriodType,
            endYear: endPeriodYear,
        })
    useEffect(emitTimeFrameChange, [
        periodType,
        startPeriodType,
        startPeriodYear,
        endPeriodType,
        endPeriodYear,
    ])

    return (
        <Grid direction="row" container spacing={3}>
            <Grid item xs={2}>
                <FormControl>
                    <InputLabel>Period type</InputLabel>
                    <Select
                        value={periodType}
                        onChange={evt => {
                            setPeriodType(evt.target.value)
                            setStartPeriodType(
                                periods[evt.target.value].items[0].value
                            )
                            setEndPeriodType(
                                periods[evt.target.value].items[
                                    checkEndPeriod(
                                        evt.target.value,
                                        endPeriodYear
                                    )
                                    // periods[
                                    //     evt.target.value
                                    // ].items.length - 1
                                ].value
                            )
                        }}
                    >
                        {['Monthly', 'Quarterly', 'Yearly'].map((dt, i) => {
                            return (
                                <MenuItem value={dt} key={i} name={dt}>
                                    {dt}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid
                className={periodType === 'Yearly' ? 'hidden-form-control' : ''}
                item
                xs={2}
            >
                <FormControl>
                    <InputLabel>
                        {`Start ${periods[periodType].label}`}
                    </InputLabel>
                    <Select
                        value={startPeriodType}
                        onChange={evt => {
                            setStartPeriodType(evt.target.value)
                        }}
                    >
                        {periods[periodType].items
                            .filter(o => {
                                var start = moment(
                                    periods[periodType].momentVal(
                                        o.value,
                                        startPeriodYear
                                    ),
                                    periods[periodType].momentFormat
                                ).valueOf()
                                var end = moment(
                                    periods[periodType].momentVal(
                                        endPeriodType,
                                        endPeriodYear
                                    ),
                                    periods[periodType].momentFormat
                                ).valueOf()
                                return start <= end;
                            })
                            .map((dt, i) => {
                                return (
                                    <MenuItem
                                        value={dt.value}
                                        key={i}
                                        name={dt}
                                    >
                                        {dt.label}
                                    </MenuItem>
                                )
                            })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={2}>
                <FormControl>
                    <InputLabel>{`Start Year`}</InputLabel>
                    <Select
                        value={
                            startPeriodYear < endPeriodYear
                                ? startPeriodYear
                                : endPeriodYear
                        }
                        onChange={evt => {
                            setStartPeriodYear(evt.target.value)
                        }}
                    >
                        {periods['Yearly'].items
                            .filter(
                                o =>
                                    _.toNumber(o.value) <=
                                    _.toNumber(endPeriodYear)
                            )
                            .map((dt, i) => {
                                return (
                                    <MenuItem
                                        className={'testClass'}
                                        value={dt.value}
                                        key={i}
                                        name={dt}
                                    >
                                        {dt.label}
                                    </MenuItem>
                                )
                            })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid
                className={periodType === 'Yearly' ? 'hidden-form-control' : ''}
                item
                xs={2}
            >
                <FormControl>
                    <InputLabel>
                        {`End ${periods[periodType].label}`}
                    </InputLabel>
                    <Select
                        value={endPeriodType}
                        onChange={evt => {
                            setEndPeriodType(evt.target.value)
                        }}
                    >
                        {periods[periodType].items
                            .filter(o => {
                                var start = moment(
                                    periods[periodType].momentVal(
                                        startPeriodType,
                                        startPeriodYear
                                    ),
                                    periods[periodType].momentFormat
                                ).valueOf()
                                var end = moment(
                                    periods[periodType].momentVal(
                                        o.value,
                                        endPeriodYear
                                    ),
                                    periods[periodType].momentFormat
                                ).valueOf()
                                if (start <= end) {
                                    if (current['Yearly'] === endPeriodYear) {
                                        var checkVal =
                                            _.isNaN(_.toNumber(o.value)) ===
                                            true
                                                ? _.toNumber(
                                                      o.value.substring(
                                                          1,
                                                          o.value.length
                                                      )
                                                  )
                                                : _.toNumber(o.value)
                                        if (
                                            checkVal <=
                                            _.toNumber(current[periodType])
                                        ) {
                                            return true;
                                        }
                                    } else {
                                        return true;
                                    }
                                }
                                return false;
                            })
                            .map((dt, i) => {
                                return (
                                    <MenuItem
                                        value={dt.value}
                                        key={i}
                                        name={dt}
                                    >
                                        {dt.label}
                                    </MenuItem>
                                )
                            })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={2}>
                <FormControl>
                    <InputLabel>{`End Year`}</InputLabel>
                    <Select
                        value={endPeriodYear}
                        onChange={evt => {
                            setEndPeriodYear(evt.target.value)
                        }}
                    >
                        {periods['Yearly'].items
                            .filter(
                                o =>
                                    _.toNumber(o.value) >=
                                        _.toNumber(startPeriodYear) &&
                                    _.toNumber(o.value) <=
                                        _.toNumber(current['Yearly'])
                            )
                            .map((dt, i) => {
                                return (
                                    <MenuItem
                                        value={dt.value}
                                        key={i}
                                        name={dt}
                                    >
                                        {dt.label}
                                    </MenuItem>
                                )
                            })}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    )
}
