const { Client, MessageAttachment } = require('discord.js');
const lib = require('./qrGen')
const data = require('./data.js')
const client = new Client();


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
    // A if-else statement 
    // if the scholar type the $qr command in the corresponding channel or in DM 
    if (msg.channel.id == data.channelID || msg.channel.type == "dm") {
        // and if message content $qr
        if(msg.content === '$qr') {
            const scholars = data.scholar();
            scholars.map(async (scholar) => {
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

client.login(data.token);