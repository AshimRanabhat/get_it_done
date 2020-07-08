const moment = require('moment');

let x = new Date();
let y = moment(x);
let today = moment();
let date = moment('2020-07-07T14:00:00.000Z');

console.log(x.toISOString(),today.toISOString(), date.toISOString())