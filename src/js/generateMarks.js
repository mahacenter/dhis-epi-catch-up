import _ from 'lodash'

export const generateMarks = timeScale => {
    var marksLabelIndexes = []
    if (timeScale.length <= 6) {
        switch (timeScale.length) {
            case 6:
                marksLabelIndexes = [0, 1, 2, 3, 4, 5]
                break
            case 5:
                marksLabelIndexes = [0, 1, 2, 3, 4]
                break
            case 4:
                marksLabelIndexes = [0, 1, 2, 3]
                break
            case 3:
                marksLabelIndexes = [0, 1, 2]
                break
            case 2:
                marksLabelIndexes = [0, 1]
                break
            case 1:
                marksLabelIndexes = [0]
                break
            default:
                marksLabelIndexes = []
                break
        }
    } else {
        marksLabelIndexes = [0, timeScale.length - 1]
        // var even = timeScale.length % 2 == 0
        var half = _.floor(timeScale.length / 2)
        marksLabelIndexes.push(half)
        var firstQuarter = _.floor(half / 2)
        marksLabelIndexes.push(firstQuarter)
        var lastQuarter = _.floor(half * 1.5)
        marksLabelIndexes.push(lastQuarter)
    }
    return timeScale.map((o, i) => {
        var obj = { value: i + 1 }
        if (marksLabelIndexes.indexOf(i) !== -1) {
            obj.label = timeScale[i].label
        }
        return obj
    })
}
