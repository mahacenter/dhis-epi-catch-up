import _ from 'lodash'
import { INDICATOR_GROUPS, INDICATORS } from './customDhisVariables'

function determineDropRateCategory(dropOut, coverage) {
    if (dropOut < 10 && coverage > 90) {
        return 15;
    }
    if (dropOut < 10 && coverage < 90) {
        return 25;
    }
    if (dropOut > 10 && coverage > 90) {
        return 35;
    }
    if (dropOut > 10 && coverage < 90) {
        return 45;
    }
    return 0;
}

const pentaDropoutIndicator = {
    id: 'custom-penta-dropout',
    name: 'Performance BCG: Coverage + Drop Out',
    group: INDICATOR_GROUPS.IMMUNIZATION,
    indicators: [INDICATORS.DROPOUT_RATE_PENTA_13, INDICATORS.PENTA_1_COVERAGE_LESS_THAN_1_YEAR],
    computeData: (indicators) => {
        const dropOutRows = _.keyBy(indicators[INDICATORS.DROPOUT_RATE_PENTA_13].rows, row => row[1]);
        const rows = indicators[INDICATORS.PENTA_1_COVERAGE_LESS_THAN_1_YEAR].rows.map(coverageRow => {
            const organisationUnit = coverageRow[1];
            const dropRateRow = dropOutRows[organisationUnit];

            if (!dropRateRow) {
                console.log('One coverage row has no dropout row', coverageRow, organisationUnit, dropOutRows);
                return ['custom-penta-dropout', organisationUnit, 0];
            }

            return ['custom-penta-dropout', organisationUnit, determineDropRateCategory(dropRateRow[2], coverageRow[2])];
        });
        return { rows: rows};
    },
    legendSet: {
        id: 'custom-penta-dropout-legend',
        name: 'Coverage + Drop Out rates',
        displayName: 'Coverage + Drop Out rates',
        legends: [
            {
                id: 'custom-penta-dropout-legend-1',
                name: 'Coverage > 90% & Drop Out < 10%',
                displayName: 'Coverage > 90% & Drop Out < 10%',
                color: '#99ff33',
                startValue: 10,
                endValue: 20,
                hideRangeValues: true,
            },
            {
                id: 'custom-penta-dropout-legend-2',
                name: 'Coverage < 90% & Drop Out < 10%',
                displayName: 'Coverage < 90% & Drop Out < 10%',
                color: 'pink',
                startValue: 20,
                endValue: 30,
                hideRangeValues: true,
            },
            {
                id: 'custom-penta-dropout-legend-3',
                name: 'Coverage > 90% & Drop Out > 10%',
                displayName: 'Coverage > 90% & Drop Out > 10%',
                color: 'yellow',
                startValue: 30,
                endValue: 40,
                hideRangeValues: true,
            },
            {
                id: 'custom-penta-dropout-legend-4',
                name: 'Coverage < 90% & Drop Out > 10%',
                displayName: 'Coverage < 90% & Drop Out > 10%',
                color: 'red',
                startValue: 40,
                endValue: 50,
                hideRangeValues: true,
            },
        ]
    },
};
export const customIndicators = [
    pentaDropoutIndicator,
]

export const customIndicatorById = _.keyBy(customIndicators, indicator => indicator.id);
export const customIndicatorsByGroup = _.groupBy(customIndicators, indicator => indicator.group);
export const customLegendById = _.keyBy(customIndicators, indicator => indicator.legendSet.id);
