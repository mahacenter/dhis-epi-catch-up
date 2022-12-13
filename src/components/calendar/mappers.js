import * as _ from "lodash";
import {indexValueByName} from "../../js/api";
import {periodToYearAndMonth} from "../../js/dates";

/**
 * @return {
  "201901": [
    {
      "regionOrDistrict": "District One",
      "value": 19.8
    },
    {
      "regionOrDistrict": "District Two",
      "value": 32.9
    }
  ],
  "202001": [
    {
      "regionOrDistrict": "District One",
      "value": 16.6
    },
    {
      "regionOrDistrict": "District Two",
      "value": 32.9
    },
  ],
  "202002": [
    {
      "regionOrDistrict": "District One",
      "value": 39.8
    },
    {
      "regionOrDistrict": "District Two",
      "value": 23.3
    }
  ]
}
 */
function extractMonthlyValues(organisationUnits, indicatorsData, timeScale) {
    const byIdOU = _.keyBy(organisationUnits, unit => unit.id);
    const timeScalePeriods = timeScale.map(period => period.value);
    const byMonthValues = _.reduce(indicatorsData, (acc, indicatorData, indicatorDataPeriod) => {
        if (!timeScalePeriods.includes(indicatorDataPeriod)) {
            return acc;
        }
        const nameToIndex = indexValueByName(indicatorData.headers);
        const districtsMonthlyValues = indicatorData.rows
            .filter(row => byIdOU[row[nameToIndex['ou']]])
            .map(row => {
                return ({
                    regionOrDistrict: byIdOU[row[nameToIndex['ou']]].name,
                    value: Number(row[nameToIndex['value']]),
                    numerator: Number(row[nameToIndex['numerator']]),
                    targetPop: Number(row[nameToIndex['denominator']]), // denominator is for 12 months: https://docs.dhis2.org/2.34/en/dhis2_implementation_guide/indicators.html
                });
            });
        acc[indicatorDataPeriod] = districtsMonthlyValues;
        return acc;
    }, {});
    return byMonthValues;
}

export function indicatorCatchUpSeries(indicatorsData, organisationUnits, timeScale) {
    if (!indicatorsData) {
        return [];
    }

    const byMonthNumeratorValues = extractMonthlyValues(organisationUnits, indicatorsData, timeScale);
    const getMonthValue = (monthlyValues, organisationUnit, period) => {
        if (!monthlyValues[period.value]) {
            return undefined;
        }
        return monthlyValues[period.value].find(ouValue => ouValue.regionOrDistrict === organisationUnit.name);
    }

    const seriesWithCatchUp = organisationUnits.map(organisationUnit => {
        let cumulatedNumerator = 0, cumulatedDenominator = 0;

        const values = timeScale.map(period => {
            const monthlyValue = getMonthValue(byMonthNumeratorValues, organisationUnit, period);

            if (!monthlyValue) {
                return undefined;
            }

            cumulatedNumerator = cumulatedNumerator + monthlyValue.numerator;
            cumulatedDenominator = cumulatedDenominator + ( monthlyValue.targetPop / 12 );
            return Math.round((cumulatedNumerator / cumulatedDenominator) * 100);
        });
        return {
            name: organisationUnit.name,
            values: values,
        };
    });

    return seriesWithCatchUp;
}

/*
    "indicatorsData has the following pattern"
    201901: {…}
        headerWidth: 8
        headers: Array(8) [ {…}, {…}, {…}, … ]
        height: 13
        rows: (13) […]
            0: Array(8) [ "FnYCr2EAzWS", "O6uvpzGd5pu", "127.2", … ]
            1: Array(8) [ "FnYCr2EAzWS", "fdc6uOvgoji", "104.5", … ]
            2: Array(8) [ "FnYCr2EAzWS", "lc3eMKXaEfw", "118.0", … ]
 */
export function mapToCalendarData(indicatorsData, organisationUnits, timeScale) {
    const byMonthValues = extractMonthlyValues(organisationUnits, indicatorsData, timeScale);

    const calendarValues = _.reduce(byMonthValues, (yearsAcc, oneMonthValues, yearMonthKey) => {
        const {year, month} = periodToYearAndMonth(yearMonthKey.toString());
        const lastYearValues = byMonthValues[`${year - 1}${month}`];
        const byNameLastYearValues = _.keyBy(lastYearValues, districtValue => districtValue.regionOrDistrict);

        const getCoverageRateDiff = oneDistrictValues => {
            const sameDistrictLastYearValues = byNameLastYearValues[oneDistrictValues.regionOrDistrict];
            if (oneDistrictValues.value === 0 || !sameDistrictLastYearValues || sameDistrictLastYearValues.value === 0) {
                return undefined;
            }
            return Number((oneDistrictValues.value - sameDistrictLastYearValues.value).toFixed(2));
        }

        const monthValuesWithCoverageRateDiff = () => oneMonthValues.map(oneDistrictValues => {
            const coverageRateDiff = getCoverageRateDiff(oneDistrictValues);
            const previousYearMonthDistrict = byNameLastYearValues[oneDistrictValues.regionOrDistrict];
            return {
                ...oneDistrictValues,
                year: year,
                month: Number(month),
                coverageRateDiff: coverageRateDiff,
                lastYear: previousYearMonthDistrict,
            };
        });

        if (!lastYearValues) {
            return yearsAcc;
        }

        const yearAcc = yearsAcc.find(yearAcc => yearAcc.year === year);
        if (yearAcc) {
            yearAcc.values = yearAcc.values.concat(monthValuesWithCoverageRateDiff());
        } else {
            yearsAcc.push({
                year: year,
                values: monthValuesWithCoverageRateDiff(),
            });
        }
        return yearsAcc;
    }, []);

    return calendarValues;
}

export function sumIndicatorNumerator(indicatorsData, organisationUnits, timeScale, lastConsideredDate) {
    const yearOfToday = lastConsideredDate.getFullYear();
    const monthOfToday = lastConsideredDate.getMonth() + 1;
    const byMonthValues = extractMonthlyValues(organisationUnits, indicatorsData, timeScale);

    const sumForYear = year => {
        const sumOfYear = {};
        _.range(1, monthOfToday).forEach(month => {
            const previousYearMonth = `${year}${_.padStart(month, 2, '0')}`;
            if (!byMonthValues[previousYearMonth]) {
                return;
            }
            byMonthValues[previousYearMonth].forEach(oneDistrictValues => {
                sumOfYear[oneDistrictValues.regionOrDistrict] = oneDistrictValues.numerator + (sumOfYear[oneDistrictValues.regionOrDistrict] || 0);
            });
        });

        return _.reduce(sumOfYear, (acc, regionOrDistrictSum, regionOrDistrictName) => {
            acc.ouSum = acc.ouSum + regionOrDistrictSum
            acc.subOUsSum.push({regionOrDistrict: regionOrDistrictName, sum: regionOrDistrictSum});
            return acc;
        }, {ouSum: 0, subOUsSum: []});
    };

    const sumLastYear = sumForYear(yearOfToday - 1);
    const sumThisYear = sumForYear(yearOfToday);

    const byRegionSumLastYear = _.keyBy(sumLastYear.subOUsSum, subOUSum => subOUSum.regionOrDistrict);
    const subOUsDiffs = sumThisYear.subOUsSum.map(subOUSum => {
        return ({
            regionOrDistrict: subOUSum.regionOrDistrict,
            diff: Math.round(subOUSum.sum - byRegionSumLastYear[subOUSum.regionOrDistrict].sum),
            sumOfThisYear: {
                year: yearOfToday,
                sum: subOUSum.sum,
            },
            sumOfLastYear: {
                year: yearOfToday - 1,
                sum: byRegionSumLastYear[subOUSum.regionOrDistrict].sum,
            }
        });
    });

    const cumulated = {
        subOUsDiffs: subOUsDiffs,
        startYear: yearOfToday - 1,
        endYear: yearOfToday,
        cumulatedDiff: Math.round(sumThisYear.ouSum - sumLastYear.ouSum),
    };
    return cumulated;
}
