'use strict';

const axios = require('axios')

module.exports = {

    getAllState : async ()=>{
        const states =await axios.get(`${process.env.COWIN_BASE_URL}${process.env.COWIN_LIST_STATE}`);
        console.log(JSON.stringify(states));
        return states;
    },

    getAllDistrictOfState : async (stateId)=>{
        const district =await axios.get(`${process.env.COWIN_BASE_URL}${process.env.COWIN_LIST_DISTRICT}`);
        console.log(JSON.stringify(district));
        return district;
    },

    getAppointmentCalendarByPin : async (pincode, date)=>{
        const appointmentCalendarbyPin =await axios.get(`${process.env.COWIN_BASE_URL}${process.env.COWIN_CALENDAR_BY_PIN}`);
        console.log(JSON.stringify(appointmentCalendarbyPin));
        return appointmentCalendarbyPin;
    },
    
    getAppointmentCalendarByDistrict : async (districtId, date)=>{
        const appointmentCalendarbyDistrict =await axios.get(`${process.env.COWIN_BASE_URL}${process.env.COWIN_CALENDAR_BY_DISTRICT}`);
        console.log(JSON.stringify(appointmentCalendarbyDistrict));
        return appointmentCalendarbyDistrict
    }

}