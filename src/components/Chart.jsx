import React from 'react';
import { Bar } from 'react-chartjs-2';
import * as _ from 'lodash';
import Box from '@material-ui/core/Box';
import { TARGETS } from '../js/customTargets';
import { ExportButton } from './ExportButton';

const AXIS = {
    AREA: 'AREA',
    ABSOLUTE: 'ABSOLUTE',
};

function buildChartOptions(props) {
    const hasMoreThanOneLabel = Boolean(props.absolutePeriodsData);
    return {
        scales: {
            yAxes: [
                {
                    type: 'linear',
                    position: 'left',
                    display: true,
                    ticks: { min: 0, max: 120 },
                    id: AXIS.AREA,
                    scaleLabel: {
                        display: hasMoreThanOneLabel,
                        labelString: 'Coverage',
                    },
                },
                {
                    type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    position: 'right',
                    display: hasMoreThanOneLabel,
                    id: AXIS.ABSOLUTE,
                    scaleLabel: {
                        display: hasMoreThanOneLabel,
                        labelString: props.circleLegend?.dataElement?.name,
                    },
                    gridLines: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                },
            ],
        },
        animation: {
            duration: 0,
        },
    };
}

const specialIndicatorDatasets = props => {
    if (!TARGETS[props.dx]) {
        return [];
    }

    return [
        {
            yAxisID: AXIS.AREA,
            label: 'Target',
            type: 'line',
            data: props.timeScale.map(() => TARGETS[props.dx]),
            borderColor: 'red',
            backgroundColor: 'transparent',
            pointRadius: 0,
            borderWidth: 2,
            order: 2,
        },
    ];
};

function absoluteValuesDatasets(props) {
    if (!props.absolutePeriodsData) {
        return [];
    }
    return [
        {
            yAxisID: AXIS.ABSOLUTE,
            label: props.circleLegend.dataElement.name,
            type: 'line',
            data: props.timeScale.map(period =>
                _.get(
                    props,
                    `absolutePeriodsData.${period.value}.${props.ou}.value`
                )
            ),
            borderColor: 'green',
            backgroundColor: 'transparent',
            pointRadius: 0,
            borderWidth: 2,
            order: 2,
        },
    ];
}

function areaDatasets(props) {
    const areaChartData = props.areaPeriodsData.map(periodData => {
        const rowOfOu = periodData.rows.find(row => row[1] === props.ou);
        return rowOfOu ? rowOfOu[2] : null;
    });
    return [
        {
            yAxisID: AXIS.AREA,
            label: 'Coverage',
            backgroundColor: 'rgba(44, 102, 147, 0.7)',
            data: areaChartData,
        },
    ];
}

export const Chart = props => {
    const id = `main-chart-${props.ou}`;

    return (
        <div className='chart' id={id}>
            <Box display='flex' alignItems='center'>
                <Box flexGrow={1}>
                    <span className='chart-title'>{props.title}</span>
                </Box>
                <ExportButton
                    id={id}
                    title='Export this chart'
                    filename={props.title}
                />
            </Box>

            <Bar
                data={{
                    labels: props.timeScale.map(e => e.label),
                    datasets: [
                        ...areaDatasets(props),
                        ...absoluteValuesDatasets(props),
                        ...specialIndicatorDatasets(props),
                    ],
                }}
                options={buildChartOptions(props)}
            />
        </div>
    );
};
