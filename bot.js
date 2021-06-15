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
        // For loop that loop the scholarDiscordID array of object
            for(i=0; i < scholarDiscordID.length; i++){
                //if the user is in the list of scholar        
                if(scholarDiscordID[i].id === msg.author.id) {
                    // get the corresponding eth address of the scholar
                    const accountAddress = scholarDiscordID[i].ethAddress;
                    // get the corresponding ETH private key of the scholar
                    const privateKey = scholarDiscordID[i].privateKey;
                    // assign msg.author.id into fileNameID for later use in saving qr
                    const fileNameID = msg.author.id
                    // feed the 2 required parameters (accountAddress and private key) into the submitSignature function and assign a accessToken to handle the return of the submitSignature function
                    accessToken = await lib.submitSignature(accountAddress, privateKey);
                    // generate the qr and feed it the required parameters the accessToken and fileNameID
                    await lib.generateQR(accessToken,fileNameID);
                    // variable for attachment (qr)
                    const attachment = new MessageAttachment('./qrcode-images/qr-'+ msg.author.id + '.png')
                    //send the qr code with the corresponding qr code via dm
                    msg.author.send(attachment);
                } else {
                    // if the user is not on the scholar send a message via dm
                    msg.author.send('You are not a scholar yet, if this a error please contact the scholar manager') 
                }
        } 

        }
    
    }
});

client.login(token);