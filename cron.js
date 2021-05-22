'use strict';
const cron = require('node-cron');
const autoTiggerService = require('./service/autoTriggerService')

const task = cron.schedule('* 6,9,12,15,18 * * *', () => {
    console.log('cronjob started...');
    autoTiggerService.triggerAlertByHour(new Date().getHours());
}, {
    scheduled: false,
    timezone: "Asia/kolkata"
});
task.start();