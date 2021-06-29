import moment from 'moment'
import { periods } from '../periods'

var checkEndPeriod = (selectedPeriod, endPeriodYear) => {
    var period = periods[selectedPeriod]
    var currentYear = moment().format('YYYY')
    var currentItem = moment().format(period.itemFormat)
    var result = period.items.length - 1
    if (endPeriodYear === currentYear) {
        for (var i = period.items.length - 1; i >= 0; i--) {
            if (period.items[i].value === currentItem) {
                result = i
            }
        }
    }
    return result
}
export { checkEndPeriod }
