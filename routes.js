'use strict';
const {Router} = require('express');
const router = Router();

const alertController = require('./controller/alertController');

router.post('/create_alert', alertController.createAlert);

module.exports = router;