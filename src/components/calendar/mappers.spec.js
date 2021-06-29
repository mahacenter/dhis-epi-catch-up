import {indicatorCatchUpSeries, mapToCalendarData, sumIndicatorNumerator} from "./mappers";

const headers = [{
    "name": "dx",
    "column": "Data",
    "valueType": "TEXT",
    "type": "java.lang.String",
    "hidden": false,
    "meta": true
}, {
    "name": "ou",
    "column": "Organisation unit",
    "valueType": "TEXT",
    "type": "java.lang.String",
    "hidden": false,
    "meta": true
}, {
    "name": "value",
    "column": "Value",
    "valueType": "NUMBER",
    "type": "java.lang.Double",
    "hidden": false,
    "meta": false
}, {
    "name": "numerator",
    "column": "Numerator",
    "valueType": "NUMBER",
    "type": "java.lang.Double",
    "hidden": false,
    "meta": false
}, {
    "name": "denominator",
    "column": "Numerator",
    "valueType": "NUMBER",
    "type": "java.lang.Double",
    "hidden": false,
    "meta": false
}];

describe('mappers', () => {

    const indicatorId = "EdN7qlmI5FS";
    const indicatorsData = {
        201901: {
            "headers": headers,
            "rows": [[indicatorId, "O6uvpzGd5pu", "19.8", "366.0", "1850.0", "100.0", "100", "1"], [indicatorId, "fdc6uOvgoji", "26.8", "438.0", "1637.0", "100.0", "100", "1"], [indicatorId, "lc3eMKXaEfw", "12.9", "249.0", "757.0", "100.0", "100", "1"], [indicatorId, "jUb8gELQApl", "15.3", "228.0", "1491.0", "100.0", "100", "1"], [indicatorId, "PMa2VCrupOd", "32.9", "386.0", "1174.0", "100.0", "100", "1"], [indicatorId, "kJq2mPyFEHo", "21.5", "406.0", "1984.0", "100.0", "100", "1"], [indicatorId, "qhqAxPSTUXp", "26.2", "193.0", "736.0", "100.0", "100", "1"]],
        },
        201902: {
            "headers": headers,
            "rows": [[indicatorId, "O6uvpzGd5pu", "29.1", "366.0", "1850.0", "100.0", "100", "1"], [indicatorId, "fdc6uOvgoji", "26.8", "438.0", "1637.0", "100.0", "100", "1"], [indicatorId, "lc3eMKXaEfw", "22.9", "249.0", "757.0", "100.0", "100", "1"], [indicatorId, "jUb8gELQApl", "15.3", "228.0", "1491.0", "100.0", "100", "1"], [indicatorId, "PMa2VCrupOd", "32.9", "386.0", "1174.0", "100.0", "100", "1"], [indicatorId, "kJq2mPyFEHo", "22.5", "406.0", "1984.0", "100.0", "100", "1"], [indicatorId, "qhqAxPSTUXp", "26.2", "193.0", "736.0", "100.0", "100", "1"]],
        },
        202001: {
            "headers": headers,
            "rows": [[indicatorId, "O6uvpzGd5pu", "16.6", "466.0", "1940.0", "100.0", "100", "1"], [indicatorId, "fdc6uOvgoji", "26.8", "338.0", "1437.0", "100.0", "100", "1"], [indicatorId, "lc3eMKXaEfw", "32.9", "249.0", "757.0", "100.0", "100", "1"], [indicatorId, "jUb8gELQApl", "15.3", "228.0", "1491.0", "100.0", "100", "1"], [indicatorId, "PMa2VCrupOd", "32.9", "386.0", "1174.0", "100.0", "100", "1"], [indicatorId, "kJq2mPyFEHo", "19.4", "406.0", "1984.0", "100.0", "100", "1"], [indicatorId, "qhqAxPSTUXp", "26.2", "193.0", "736.0", "100.0", "100", "1"]],
        },
        202002: {
            "headers": headers,
            "rows": [[indicatorId, "O6uvpzGd5pu", "39.8", "386.0", "1890.0", "100.0", "100", "1"], [indicatorId, "fdc6uOvgoji", "26.8", "408.0", "1137.0", "100.0", "100", "1"], [indicatorId, "lc3eMKXaEfw", "23.3", "249.0", "757.0", "100.0", "100", "1"], [indicatorId, "jUb8gELQApl", "15.3", "228.0", "1491.0", "100.0", "100", "1"], [indicatorId, "PMa2VCrupOd", "32.9", "386.0", "1174.0", "100.0", "100", "1"], [indicatorId, "kJq2mPyFEHo", "18.8", "406.0", "1984.0", "100.0", "100", "1"], [indicatorId, "qhqAxPSTUXp", "26.2", "193.0", "736.0", "100.0", "100", "1"]],
        },
        202101: {
            "headers": headers,
            "rows": [[indicatorId, "O6uvpzGd5pu", "16.6", "466.0", "1940.0", "100.0", "100", "1"], [indicatorId, "fdc6uOvgoji", "26.8", "338.0", "1437.0", "100.0", "100", "1"], [indicatorId, "lc3eMKXaEfw", "32.9", "249.0", "757.0", "100.0", "100", "1"], [indicatorId, "jUb8gELQApl", "15.3", "228.0", "1491.0", "100.0", "100", "1"], [indicatorId, "PMa2VCrupOd", "32.9", "386.0", "1174.0", "100.0", "100", "1"], [indicatorId, "kJq2mPyFEHo", "19.4", "406.0", "1984.0", "100.0", "100", "1"], [indicatorId, "qhqAxPSTUXp", "26.2", "193.0", "736.0", "100.0", "100", "1"]],
        },
        202102: {
            "headers": headers,
            "rows": [[indicatorId, "O6uvpzGd5pu", "39.8", "386.0", "1890.0", "100.0", "100", "1"], [indicatorId, "fdc6uOvgoji", "26.8", "408.0", "1137.0", "100.0", "100", "1"], [indicatorId, "lc3eMKXaEfw", "23.3", "249.0", "757.0", "100.0", "100", "1"], [indicatorId, "jUb8gELQApl", "15.3", "228.0", "1491.0", "100.0", "100", "1"], [indicatorId, "PMa2VCrupOd", "32.9", "386.0", "1174.0", "100.0", "100", "1"], [indicatorId, "kJq2mPyFEHo", "18.8", "406.0", "1984.0", "100.0", "100", "1"], [indicatorId, "qhqAxPSTUXp", "26.2", "193.0", "736.0", "100.0", "100", "1"]],
        },
    };

    const organisationUnits = [
        {id: "O6uvpzGd5pu", name: "District One"},
        {id: "lc3eMKXaEfw", name: "District Two"},
        {id: "kJq2mPyFEHo", name: "District Three"}];

    describe('mapToCalendarData', () => {
        it('should transform DHIS data to CalendarGraph data', () => {
            const timeScale = [{value: '201901'}, {value: '201902'}, {value: '201903'}, {value: '202001'}, {value: '202002'}, {value: '202003'}];

            const calendarData = mapToCalendarData(indicatorsData, organisationUnits, timeScale);

            expect(calendarData).toEqual([
                {
                    "year": 2020,
                    "values": [
                        {
                            "coverageRateDiff": -3.2,
                            "lastYear": {
                                "numerator": 366,
                                "regionOrDistrict": "District One",
                                "targetPop": 1850,
                                "value": 19.8
                            },
                            "month": 1,
                            "numerator": 466,
                            "regionOrDistrict": "District One",
                            "targetPop": 1940,
                            "value": 16.6,
                            "year": 2020
                        },
                        {
                            "coverageRateDiff": 20,
                            "lastYear": {
                                "numerator": 249,
                                "regionOrDistrict": "District Two",
                                "targetPop": 757,
                                "value": 12.9
                            },
                            "month": 1,
                            "numerator": 249,
                            "regionOrDistrict": "District Two",
                            "targetPop": 757,
                            "value": 32.9,
                            "year": 2020
                        },
                        {
                            "coverageRateDiff": -2.1,
                            "lastYear": {
                                "numerator": 406,
                                "regionOrDistrict": "District Three",
                                "targetPop": 1984,
                                "value": 21.5
                            },
                            "month": 1,
                            "numerator": 406,
                            "regionOrDistrict": "District Three",
                            "targetPop": 1984,
                            "value": 19.4,
                            "year": 2020
                        },
                        {
                            "coverageRateDiff": 10.7,
                            "lastYear": {
                                "numerator": 366,
                                "regionOrDistrict": "District One",
                                "targetPop": 1850,
                                "value": 29.1
                            },
                            "month": 2,
                            "numerator": 386,
                            "regionOrDistrict": "District One",
                            "targetPop": 1890,
                            "value": 39.8,
                            "year": 2020
                        },
                        {
                            "coverageRateDiff": 0.4,
                            "lastYear": {
                                "numerator": 249,
                                "regionOrDistrict": "District Two",
                                "targetPop": 757,
                                "value": 22.9
                            },
                            "month": 2,
                            "numerator": 249,
                            "regionOrDistrict": "District Two",
                            "targetPop": 757,
                            "value": 23.3,
                            "year": 2020
                        },
                        {
                            "coverageRateDiff": -3.7,
                            "lastYear": {
                                "numerator": 406,
                                "regionOrDistrict": "District Three",
                                "targetPop": 1984,
                                "value": 22.5
                            },
                            "month": 2,
                            "numerator": 406,
                            "regionOrDistrict": "District Three",
                            "targetPop": 1984,
                            "value": 18.8,
                            "year": 2020
                        }
                    ],
                }
            ]);
        });
    });

    describe('sumIndicatorNumerator', () => {
        it('should transform DHIS data to CalendarGraph cumulated data', () => {
            const timeScale = [{value: '201901'}, {value: '201902'}, {value: '201903'}, {value: '202001'}, {value: '202002'}, {value: '202003'}];

            const cumulated = sumIndicatorNumerator(indicatorsData, organisationUnits, timeScale, new Date('2020-11-01'));

            expect(cumulated).toEqual({
                "cumulatedDiff": 120,
                "endYear": 2020,
                "startYear": 2019,
                "subOUsDiffs": [
                    {
                        "diff": 120,
                        "regionOrDistrict": "District One",
                        "sumOfLastYear": {
                            "sum": 732,
                            "year": 2019
                        },
                        "sumOfThisYear": {
                            "sum": 852,
                            "year": 2020
                        }
                    },
                    {
                        "diff": 0,
                        "regionOrDistrict": "District Two",
                        "sumOfLastYear": {
                            "sum": 498,
                            "year": 2019
                        },
                        "sumOfThisYear": {
                            "sum": 498,
                            "year": 2020
                        }
                    },
                    {
                        "diff": 0,
                        "regionOrDistrict": "District Three",
                        "sumOfLastYear": {
                            "sum": 812,
                            "year": 2019
                        },
                        "sumOfThisYear": {
                            "sum": 812,
                            "year": 2020
                        }
                    }
                ]
            });
        });
    });

    describe('indicatorCatchUpSeries', () => {
        it('should transform DHIS data elements to MultiLineGraph cumulated data', () => {
            const timeScale = [{value: '202001'}, {value: '202002'}, {value: '202003'}];

            const cumulated = indicatorCatchUpSeries(indicatorsData, organisationUnits, timeScale);

            expect(cumulated).toEqual([{
                name: 'District One',
                values: [288, 267, undefined],
            }, {
                name: 'District Two',
                values: [395, 395, undefined],
            }, {
                name: 'District Three',
                values: [246, 246, undefined],
            }]);
        });
    });
});
