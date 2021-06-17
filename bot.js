const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const lib = require('./qrGen')
const data = require('./data.js')
const client = new Client();
const scholars = data.scholar();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
    // A if-else statement 
    // if the scholar type the $qr command in the corresponding channel or in DM 
    if (msg.channel.id == data.channelID || msg.channel.type == "dm") {
        // and if message content $qr
        if(msg.content === '$qr') {
            scholars.map(async (scholar) => {
                if (scholar.id === msg.author.id) {
                    const accountAddress = scholar.ethAddress;
                    const privateKey = scholar.privateKey;
                    const fileNameID = msg.author.id;
                    const randMessage = await getRawMessage();
                    const accessToken = await lib.submitSignature(accountAddress, privateKey, randMessage);
                    await lib.generateQR(accessToken,fileNameID);
                    const attachment = new MessageAttachment('./qrcode-images/qr-'+ msg.author.id + '.png')
                    await msg.author.send("Here is your qr login code " + scholar.name)
                    msg.author.send(attachment);
                    console.log(scholar.name + ' requested QR');
                }
            })
        }
    
    };

    if(msg.content === '!status') {
        scholars.map(async (scholar) => {
            if(scholar.id === msg.author.id) {
                const accountAddress = scholar.ethAddress;
                const status = await data.getStatus(accountAddress);
                const embed = new MessageEmbed()
                    .setTitle("Here is your current game status")
                    .setAuthor(msg.author.username)
                    .addField('Currents SLP count: ', status['total'], true)
                    .addField('Claimable SLP: ', status['claimable_total'], true);

                msg.reply(embed)
                

            } 
        })

    }

});

client.login(data.token);