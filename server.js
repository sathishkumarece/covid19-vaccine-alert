'use strict';
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const routes = require('./routes');
const client = require('./service/whatsappService');

//Trigger cron job
require('./cron');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':true}));

dotenv.config();

if(process.env.NODE_ENV ==='production'){
    const path = require('path');
    app.use(express.static(path.join(__dirname, 'client', 'build')))
}else{
    app.get('/', (req, res) =>{
        res.send('Servering the response from server');
    })
}

app.get('/wsm', async (req,res)=>{
    await client.sendMessage("917604961875" + '@c.us', "Greeting!")
    res.send('Message sent');
})

app.use('/', routes);

const port = process.env.PORT | 8080;
app.listen(port, ()=>{
    console.log(`Server started at ${port}`);
})

