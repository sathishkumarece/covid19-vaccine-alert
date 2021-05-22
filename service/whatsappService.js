'use strict';
const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal')


let sessionData;
let sessionId = 0;
if (fs.existsSync(`${process.cwd()}/sessions/session_${sessionId}.json`)) {
    sessionData = require(`${process.cwd()}/sessions/session_${sessionId}.json`)
}

const client = new Client({
    session: sessionData
})

client.on('qr', (qr) => {
    console.log(`QR code for client ${sessionId}`)
    qrcode.generate(qr, { small: true })
})

client.on('authenticated', (session) => {
    console.log(`Authenticated for client ${sessionId}`)
    sessionData = session
    fs.writeFile(`${process.cwd()}/sessions/session_${sessionId}.json`,
      JSON.stringify(session),
      function (err) {
        if (err) {
          console.error(err)
        }
      }
    )
})

client.on('auth_failure', (msg) => {
    console.error("Auth Failure: ",msg);
})

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg) => {
    
    if(msg.body.toLowerCase().startsWith('stop alert #')){
        const alertController = require('../controller/alertController');
        const response = await alertController.deleteAlert( Number(msg.body.split('#')[1].trim()),
        msg.from.split('@')[0]);
        console.log(JSON.stringify(response));
        if(response.status && response.data > 0){
            msg.reply('Alert successfully deleted');
        }else{
            msg.reply('Something went wrong, try again later');
        }
    }else{
        msg.reply('Wrong command');
    }
});

client.initialize();

module.exports = client;