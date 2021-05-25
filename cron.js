'use strict';
const cron = require('node-cron');
const autoTiggerService = require('./service/autoTriggerService');
const stateDistrictService = require('./service/stateDistrictService');

const task = cron.schedule('* 6,9,12,15,18 * * *', () => {
    console.log('cronjob started...');
    autoTiggerService.triggerAlertByHour(new Date().getHours());
}, {
    scheduled: false,
    timezone: "Asia/kolkata"
});
task.start();

const sdTask = cron.schedule('00 03 * * *', () => {
    console.log('cronjob started for state and district...');
    stateDistrictService.stateAndDistrictManagement();
}, {
    scheduled: false,
    timezone: "Asia/kolkata"
});
// sdTask.start();

