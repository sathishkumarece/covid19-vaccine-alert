'use strict';
const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');

let sessionData;
let headless = true;
let puppeteer = {
    headless
  }
let sessionId = 0;
if (fs.existsSync(`${process.cwd()}/sessions/session_${sessionId}.json`)) {
    sessionData = require(`${process.cwd()}/sessions/session_${sessionId}.json`)
}
const chromePath = process.env.CHROME_PATH;
if (fs.existsSync(chromePath)) {
    puppeteer.executablePath = path.resolve(chromePath);
    puppeteer.args = ['--no-sandbox'];
    puppeteer.ignoreHTTPSErrors = true;
}

const client = new Client({
    session: sessionData,
    puppeteer
})

client.on('qr', (qr) => {
    console.log(`QR code for client ${sessionId}`)
    qrcode.generate(qr, { small: true })
})

client.on('authenticated', (session) => {
    console.log(`Authenticated for client ${sessionId}`);
    // sessionData = session;
    if (!fs.existsSync(`${process.cwd()}/sessions`)){
        fs.mkdirSync(`${process.cwd()}/sessions`);
    }
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