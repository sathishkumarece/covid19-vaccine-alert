'use strict';

const cowinAPIService = require('./cowinAPIService');
const stateDistrictController = require('../controller/stateDistrictController');

module.exports = {
    stateAndDistrictManagement : async ()=>{

        const states = await cowinAPIService.getAllState();
        await stateDistrictController.createStates(states.states);

        for(let state of states.states){
            let districts = await cowinAPIService.getAllDistrictOfState(state.state_id);
            await stateDistrictController.createDistricts(state.state_id, districts.districts);
        }
    }
}