require('dotenv').config()
const { Client, MessageAttachment } = require('discord.js');
const lib = require('./qrGen')
const client = new Client();

// your discord key 
const token = process.env.DISCORD_BOT_KEY;
// the channel id of your server where the scholar to request qr
const channelID = process.env.CHANNEL_ID;
//parse the process.env.SCHOLAR to make it a array of object
const scholarDiscordID = JSON.parse(process.env.SCHOLAR)

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
    // A if-else statement 
    // if the scholar type the $qr command in the corresponding channel or in DM 
    if (msg.channel.id == channelID || msg.channel.type == "dm") {
        // and if message content $qr
        if(msg.content === '$qr') {
            scholarDiscordID.map(async (scholar) => {
                if (scholar.id === msg.author.id) {
                    const accountAddress = scholar.ethAddress;
                    const privateKey = scholar.privateKey;
                    const fileNameID = msg.author.id;
                    const accessToken = await lib.submitSignature(accountAddress, privateKey);
                    await lib.generateQR(accessToken,fileNameID);
                    const attachment = new MessageAttachment('./qrcode-images/qr-'+ msg.author.id + '.png')
                    await msg.author.send("Here is your qr login code " + scholar.name)
                    msg.author.send(attachment);
                    console.log(scholar.name + ' requested QR');
                }


            })
        }
    
    }
});

client.login(token);