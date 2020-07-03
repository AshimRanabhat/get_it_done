const moment = require('moment');

function getCalendar(year) {
    if (!year) year = moment().get('year');
    if (Number.isInteger(year) == false) throw ('year is not an integer');

    let day = moment([year]).startOf('year');
    let lastDay = moment([year]).endOf('year');
    let yearlyCalender = [];

    for (day; day <= lastDay; day.add(1, 'day')) {
        yearlyCalender.push(day.clone().toISOString());
    }
    return yearlyCalender;
}

let months=[
    'January', 'Febuary', 'March', 'April', 'May', 'June',
     'July', 'August', 'September', 'October', 'November', 'December'
];

let successfulDays = ['2020-03-24T13:00:00.000Z',
    '2020-03-25T13:00:00.000Z',
    '2020-03-26T13:00:00.000Z',
    '2020-03-27T13:00:00.000Z',
    '2020-03-28T13:00:00.000Z',
    '2020-03-29T13:00:00.000Z',
    '2020-03-30T13:00:00.000Z',
    '2020-03-31T13:00:00.000Z',
    '2020-04-01T13:00:00.000Z',
    '2020-04-02T13:00:00.000Z',
    '2020-02-09T13:00:00.000Z',
    '2020-02-10T13:00:00.000Z',
    '2020-02-11T13:00:00.000Z',
    '2020-02-12T13:00:00.000Z'
];

module.exports = {
    getCalendar,
    months,
    successfulDays
}