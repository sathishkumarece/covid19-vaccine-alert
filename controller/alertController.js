'use strict';
const db = require('../model');
const AlertModel = db.alert;
const Op = db.Sequelize.Op;
const client = require('../service/whatsappService');

module.exports = {
    createAlert : async (req, res)=>{
        console.log('Entering to create alert');
        const body = req.body;
        let response = {
            data: {},
            code: 500,
            message: 'Invalid request',
            status: false
        }
        const is = await client.isRegisteredUser(body.phone_no + '@c.us')
        if(!is){
            res.status(response.code).json({...response, message: "Invalid whatsapp number"});
        }else{
            try{
                response = await alertCreation(body);
                console.log(`Sending confirmation message to ${body.phone_no}`);
                client.sendMessage(`${body.phone_no}@c.us`, `Covid19 vaccine alert registration is successful. Alert number #${response.data.id}`);
                res.status(response.code).json(response);
            }catch (err){
                console.error(err)
                res.status(response.code).json({...response, message: "Error occured during alert creation"});
            }
        }
    
    },
    getAllAlert: async() =>{
        console.log('Entering to getting all alert');
        let response = {
            data: {},
            code: 500,
            message: 'Invalid request',
            status: false
        }
        try{
            let alerts = {}
            alerts.data = await AlertModel.findAll({raw:true});
            alerts.code = 200,
            alerts.message = 'Alerts are retrieved successfully'
            alerts.status = true;
            return alerts;
        }catch (err){
            console.error(err)
            return {...response, message: "Error occured during alert creation"};
        }
    },

    getAlertByFrequency: async(frequency) =>{
        console.log('Entering to get frequency alert');
        let response = {
            data: {},
            code: 500,
            message: 'Invalid request',
            status: false
        }
        try{
            let alerts = {}
            alerts.data = await AlertModel.findAll({where: {alert_frequency:frequency}, raw:true});
            alerts.code = 200,
            alerts.message = 'Alerts are retrieved successfully'
            alerts.status = true;
            return alerts;
        }catch (err){
            console.error(err)
            return {...response, message: "Error occured during alert creation"};
        }
    },

    deleteAlert: async(alertId, phone_no)=>{
        console.log('Entering to delete alert');
        let response = {
            data: {},
            code: 500,
            message: 'Invalid request',
            status: false
        }
        try{
            let alerts = {}
            alerts.data = await AlertModel.destroy({where: {id:alertId, phone_no}, raw:true});
            alerts.code = 200,
            alerts.message = 'Alert deleted successfully'
            alerts.status = true;
            return alerts;
        }catch (err){
            console.error(err)
            return {...response, message: "Error occured during alert creation"};
        }
    }
}

async function alertCreation(body){
    let response = {}
    response.data = await AlertModel.create(body);
    response.message = 'Alert has been created successfully';
    response.code = 200;
    response.status = true;
    return response;
}