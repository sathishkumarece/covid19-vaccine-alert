'use strict';
const cron = require('node-cron');
const autoTiggerService = require('./service/autoTriggerService')

const task = cron.schedule('6,9,12,15,18 * * * *', () => {
    logger.info('cronjob started...');
    // autoTiggerService.triggerAlert(hour);
}, {
    scheduled: false,
    timezone: "Asia/kolkata"
});
task.start();