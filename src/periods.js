import moment from 'moment'

export const periods = {
    Monthly: {
        label: 'Month',
        items: [
            { label: 'January', value: '01' },
            { label: 'February', value: '02' },
            { label: 'March', value: '03' },
            { label: 'April', value: '04' },
            { label: 'May', value: '05' },
            { label: 'June', value: '06' },
            { label: 'July', value: '07' },
            { label: 'August', value: '08' },
            { label: 'September', value: '09' },
            { label: 'October', value: '10' },
            { label: 'November', value: '11' },
            { label: 'December', value: '12' },
        ],
        itemFormat: 'MM',
        momentFormat: 'MM-YYYY',
        d2Format: 'YYYYMM',
        labelFormat: 'MMMM YYYY',
        momentVal: (period, year) => `${period}-${year}`,
        duration: duration => moment.duration(duration).asMonths(),
        addParam: 'months',
        currentFormat: 'MM'
    },
    Quarterly: {
        label: 'Quarter',
        items: [
            { label: 'Q1', value: 'Q1' },
            { label: 'Q2', value: 'Q2' },
            { label: 'Q3', value: 'Q3' },
            { label: 'Q4', value: 'Q4' },
        ],
        itemFormat: '[Q]Q',
        momentFormat: 'Q-YYYY',
        d2Format: 'YYYY[Q]Q',
        labelFormat: '[Q]Q YYYY',
        momentVal: (period, year) => `${period[1]}-${year}`,
        duration: duration => moment.duration(duration).asQuarters(),
        addParam: 'quarters',
        currentFormat: 'Q'
    },
    Yearly: {
        label: 'Year',
        items: [
            { label: '2017', value: '2017' },
            { label: '2018', value: '2018' },
            { label: '2019', value: '2019' },
            { label: '2020', value: '2020' },
        ],
        itemFormat: 'YYYY',
        momentFormat: 'YYYY',
        d2Format: 'YYYY',
        labelFormat: 'YYYY',
        momentVal: (period, year) => `${year}`,
        duration: duration => moment.duration(duration).asYears(),
        addParam: 'years',
        currentFormat: 'YYYY'
    },
}

export function periodsRange(pType, pBounds) {
    var startDate = moment(
        periods[pType].momentVal(pBounds.startType, pBounds.startYear),
        periods[pType].momentFormat
    )
    var endDate = moment(
        periods[pType].momentVal(pBounds.endType, pBounds.endYear),
        periods[pType].momentFormat
    )
    var start = endDate.valueOf() > startDate.valueOf() ? startDate : endDate
    var end = endDate.valueOf() > startDate.valueOf() ? endDate : startDate
    var duration =
        end.add(1, periods[pType].addParam).valueOf() - start.valueOf()
    var timeLength = Math.round(periods[pType].duration(duration))
    var index = []
    for (var i = 0; i < timeLength; i++) {
        var initDate = moment(
            periods[pType].momentVal(pBounds.startType, pBounds.startYear),
            periods[pType].momentFormat
        )
        index.push({
            label: initDate
                .add(i, periods[pType].addParam)
                .format(periods[pType].labelFormat),
            value: initDate.format(periods[pType].d2Format),
        })
    }
    return index
}
