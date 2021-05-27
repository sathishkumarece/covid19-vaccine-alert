'use strict';
const messageUtil = require('../utils/messageUtil');
const alertController = require('../controller/alertController');
const cowinAPIService = require('./cowinAPIService');
const client = require('./whatsappService');
const os = require('os');

module.exports = {
    triggerAlertByHour: (hour)=>{
        //Check the range to retrieve alerts
        const is6Hours = hour%6;
        let frequency = [3];
        if(is6Hours === 0){
            frequency.push(6);
        }
        if(hour === 6){
            frequency.push(24);
        }
        getAlertsBasedCenters(frequency);
    }
}

async function getAlertsBasedCenters(frequency){
    //Get alerts based on the hours
    const response = await alertController.getAlertByFrequency(frequency);
    if(response.status){
        const alerts = response.data;
        //consonlidate the alerts to reduce the number calls to cowin API
        let districtAlerts = new Map();
        let pincodeAlerts = new Map();
        alerts.map(alert => {
            if(alert.state && alert.district){
                if(districtAlerts.has(alert.district)){
                    const disAlerts = districtAlerts.get(alert.district);
                    districtAlerts.delete(alert.district);
                    districtAlerts.set(alert.district, [...disAlerts, alert]);
                }else{
                    districtAlerts.set(alert.district, [alert]);
                }
            }else if(alert.pincode){
                if(pincodeAlerts.has(alert.pincode)){
                    const pinAlert = pincodeAlerts.get(alert.pincode);
                    pincodeAlerts.delete(alert.pincode);
                    pincodeAlerts.set(alert.pincode, [...pinAlert, alert]);
                }else{
                    pincodeAlerts.set(alert.pincode, [alert]);
                }
            }
        });
        //Get the centers availability
        const districtCenters = await getAvailableVaccineData(districtAlerts,'district');
        const pincodeCenters = await getAvailableVaccineData(pincodeAlerts,'pincode');

        processAlerts(districtAlerts,districtCenters);
        processAlerts(pincodeAlerts,pincodeCenters);
    }
}

async function getAvailableVaccineData(alertsMap, type){
    let centersMap = new Map();
    for(let key of alertsMap.keys()){
        let centers;
        if(type === 'district'){
            centers = await cowinAPIService.getAppointmentCalendarByDistrict(key, dateFormat(new Date()))
        }else if(type === 'pincode'){
            centers = await cowinAPIService.getAppointmentCalendarByPin(key, dateFormat(new Date()))
        }

        //center will be eligible only atleast of the session holds vaccine availability
        centers = centers.centers.filter(center => {
            for(let session of center.sessions){
                if(session.available_capacity > 0){
                    return true;
                }
            }
            return false;
        })
        centersMap.set(key, centers)
    }
    return centersMap;
}

function dateFormat(date){
    let day = ''+date.getDate();
    let month = ''+ (date.getMonth()+1);
    if(day.length<2){
	    day = '0'+day
    }
    if(month.length<2){
        month = '0'+month
    }
    return `${day}-${month}-${date.getFullYear()}`;
}

function processAlerts(allAlerts, allCenters){
    for(let [key, alerts] of allAlerts.entries()){
        for(let alert of alerts){
            if(allCenters.has(key)){
                const centers = allCenters.get(key);
                for(let center of centers){
                    if(alert.fee_type === null || 
                        alert.fee_type.toLowerCase() === center.fee_type.toLowerCase()){
                        let count = 0;
                        let sessionVal = '';
                        for(let session of center.sessions){
                            if(count < alert.day_range){
                                if(alert.dose_type === null && alert.vaccine_name === null && 
                                    alert.min_age === null){
                                        sessionVal+=messageUtil.getSessionInfo(session) + os.EOL
                                }else{
                                    const dose = `available_capacity_dose${alert.dose_type}`
                                    if(((alert.dose_type && session[dose] > 0) || alert.dose_type === null) && 
                                        ((alert.vaccine_name === null && alert.min_age === null) || 
                                            (alert.vaccine_name === null && alert.min_age === session.min_age_limit) || 
                                            (alert.vaccine_name.toUpperCase() === session.vaccine && alert.min_age === null) || 
                                            (alert.vaccine_name.toUpperCase() === session.vaccine && alert.min_age === session.min_age_limit))){
                                                sessionVal+=messageUtil.getSessionInfo(session) + os.EOL
                                    }
                                }
                                count++;
                            }else{
                                break;
                            }
                        }
                        const header = 'Vaccine Availability Alert'
                        const footer = `To unsubscribe send "Stop Alert #${alert.id}"`;
                        if(sessionVal){
                            sendMessage(header+os.EOL+messageUtil.getCenterInfo(center)+os.EOL+'Sessions: '+os.EOL+sessionVal+os.EOL+footer, alert.phone_no);
                        }
                    }
                }
            }
        }
    }
}

function sendMessage (message, phone_no){
    console.log(`Sending message to ${phone_no}`);
    client.sendMessage(`${phone_no}@c.us`, message);
}