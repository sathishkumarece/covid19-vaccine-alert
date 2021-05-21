'use strict';
const dotenv = require('dotenv');
const process = require('process');

const conf = dotenv.config(
    {
        path: `${process.cwd()}/.env`
    }
);

module.exports = {
    development: {
        username: conf.parsed.DB_USERNAME,
        password: conf.parsed.DB_PASSWORD,
        database: conf.parsed.DB_NAME,
        host: conf.parsed.DB_HOSTNAME,
        port: conf.parsed.DB_PORT,
        dialect: 'postgres',
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        dialect: 'postgres',
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        dialect: 'postgres',
    }
};
