export const periodToYearAndMonth = period => ({
    year: Number(period.substring(0, 4)),
    month: period.substring(4, 6),
});

export const periodToDate = period => {
    const {year, month} = periodToYearAndMonth(period);
    return new Date(Date.parse(`${year}-${month}`));
}
