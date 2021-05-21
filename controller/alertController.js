'use strict';
const db = require('../model');
const AlertModel = db.alert;
const Op = db.Sequelize.Op;

module.exports = {
    createAlert : async (req, res)=>{
        const body = req.body;
        let response = {
            data: {},
            code: 500,
            message: 'Invalid request',
            status: false
        }
        try{
            response = await alertCreation(body);
            res.status(response.code).json(response);
        }catch (err){
            console.error(err)
            res.status(response.code).json({...response, message: "Error occured during alert creation"});
        }
    
    },
    getAllAlert: async() =>{
        let response = {
            data: {},
            code: 500,
            message: 'Invalid request',
            status: false
        }
        try{
            let alerts = {}
            alerts.data = AlertModel.findAll({raw:true});
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