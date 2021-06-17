require('dotenv').config()

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
        // data.push(new Object());
    }
    return data;
    
}

module.exports = { scholar, token, channelID }