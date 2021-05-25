'use strict';
const {Router} = require('express');
const router = Router();

const alertController = require('./controller/alertController');
const stateDistrictController = require('./controller/stateDistrictController');

router.post('/create_alert', alertController.createAlert);
router.get('/states', stateDistrictController.getAllStates);
router.get('/districts/:state_id', stateDistrictController.getAllDistrictsOfState);

module.exports = router;