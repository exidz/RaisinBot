require('dotenv').config()
const fetch = require('node-fetch');

// your discord key 
const token = process.env.DISCORD_BOT_KEY;
// the channel id of your server where the scholar to request qr
const channelID = process.env.CHANNEL_ID;
// scholar data
const scholarDiscordID = JSON.parse(process.env.SCHOLAR)

const scholar = () => {
    const data = new Array();
    for (i =0; i < scholarDiscordID.length; i++) {
        data.push(new Object(scholarDiscordID[i]));
    }
    return data;  
};

const getStatus = async (accountAddress) => {
    try {
        const url = 'https://lunacia.skymavis.com/game-api/clients/' + accountAddress + '/items/1';
        const response = await (await fetch(url)).json();
        return response;
        
    } catch (error) {
        console.log(error);
        
    }
};




module.exports = { scholar, token, channelID, getStatus }