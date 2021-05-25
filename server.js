'use strict';
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const client = require('./service/whatsappService');

//Trigger cron job
require('./cron');

//Limit the number of alert created
const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message:  {
          status: false,
          code: 429,
          data :{},
          message:"Too many request from this IP, allow limit: 5 per hour. please try again after an hour"
        }
  });

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':true}));
app.set('trust proxy', 1);
// app.use(apiLimiter);

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
    // await client.sendMessage("917604961875" + '@c.us', "Greeting!")
    res.send('Message sent');
})

app.use('/location', routes)

//Only 5 request are allowed during 1 hour
app.use('/api', apiLimiter ,routes);

const port = process.env.PORT | 8080;
app.listen(port, ()=>{
    console.log(`Server started at ${port}`);
})

