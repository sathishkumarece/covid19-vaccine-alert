'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/dbConfig')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.alert = require("./alert.js")(sequelize, Sequelize);
db.state = require("./state.js")(sequelize, Sequelize);
db.district = require("./district.js")(sequelize, Sequelize);

module.exports = db;