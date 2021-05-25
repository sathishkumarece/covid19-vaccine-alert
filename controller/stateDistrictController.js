'use strict';

const db = require('../model');
const StateModel = db.state;
const DistrictModel = db.district;

module.exports = {
    getAllStates: async (req, res)=>{
        console.log('Entering to getting all states');
        let response = {
            data: {},
            code: 500,
            message: 'Invalid request',
            status: false
        }
        try{
            let states = {}
            states.states = await StateModel.findAll({raw:true});
            states.code = 200,
            states.message = 'States are retrieved successfully'
            states.status = true;
            return res.status(states.code).json(states);
        }catch (err){
            console.error(err)
            return res.status(response.code).response({...response, message: "Error occured during alert creation"});
        }
    },
    getAllDistrictsOfState: async (req, res)=>{
        console.log('Entering to getting all states');
        let response = {
            data: {},
            code: 500,
            message: 'Invalid request',
            status: false
        }
        try{
            const state_id = Number(req.params.state_id);
            let districts = {}
            districts.districts = await DistrictModel.findAll({where: {state_id}, raw:true});
            districts.code = 200,
            districts.message = 'Districts are retrieved successfully'
            districts.status = true;
            return res.status(districts.code).json(districts);
        }catch (err){
            console.error(err)
            return res.status(response.code).response({...response, message: "Error occured during alert creation"});
        }
    },
    createStates : async (states)=>{
        const response = await StateModel.destroy({where: {},
            truncate: true});
        console.log(`${response} rows has been deleted`);
        await StateModel.bulkCreate(states);
        console.log('All states are inserted');
    },
    createDistricts : async (state_id, districts)=>{
        const response = await DistrictModel.destroy({where:{state_id}});
        console.log(`${response} rows has been deleted`);
        const newDistricts = districts.map(district => ({...district, state_id}));
        await DistrictModel.bulkCreate(newDistricts);
        console.log('All districts are inserted');
    }

}
