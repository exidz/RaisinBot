require('dotenv').config()
const { MessageAttachment, MessageEmbed } = require('discord.js');
const app = require('./features/getStatus.js')
const lib = require('./features/getQR.js')
const getPrice = require('./features/getPriceSLP.js')
const scholars = JSON.parse(process.env.SCHOLAR);
const slicer = require('./features/slicer.js')

const prefix = '!'
const managerID = JSON.parse(process.env.ADMIN_ID);

module.exports = async (msg) => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

    if (command === 'mystatus') {
        scholars.map(async (scholar) => {
            if(scholar.id === msg.author.id) {
                const roninAddress = scholar.roninAddress;
                const data = await app.getStatus(roninAddress); 
                if(data === false) {
                    msg.reply('Please Try again');
                } else {
                    const timestamp = data['last_claimed_item_at'] * 1000
                    const dateOne = new Date(timestamp);
                    const dateTwo = new Date(timestamp + + 12096e5)
                    const options = { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric', 
                        hour: 'numeric', 
                        minute: 'numeric', 
                        second: 'numeric', 
                        timeZoneName: 'short' };
                    const lastClaimed = dateOne.toLocaleDateString(undefined, options);
                    const claimAt = dateTwo.toLocaleDateString(undefined, options);
                    const currentSLP = data['blockchain_related']['balance']
                    const claimableSLP = data['raw_total'] - data['raw_claimable_total']
                    const embed = new MessageEmbed()
                        .setAuthor(msg.author.username)
                        .addField('Currents SLP count: ', currentSLP)
                        .addField('Claimable SLP: ', claimableSLP)
                        .addField('Last Claimed Date : ', lastClaimed)
                        .addField('Next Claim Date: ', claimAt)
                        .setTimestamp()
                        .setFooter('Exidz Academy Bot' );  
                    msg.reply(embed);
                    console.log(`Check status by ${msg.author.tag}`);
                }                    
            } 
        })        
    } else if (command === 'qr') {
        scholars.map(async (scholar) => {
            if (scholar.id === msg.author.id) {
                const accountAddress = scholar.roninAddress;
                const privateKey = scholar.roninPrivateKey;
                const fileNameID = msg.author.id;
                const haveError = await lib.getRawMessage();
                if(haveError === true) {
                    msg.reply('Please Try again');
                } else {
                    const randMessage = await lib.getRawMessage();
                    const accessToken = await lib.submitSignature(accountAddress, privateKey, randMessage);
                    await lib.generateQR(accessToken,fileNameID);
                    const attachment = new MessageAttachment('./qrcode-images/qr-'+ msg.author.id + '.png');
                    await msg.author.send(`Thanks for waiting, here is your qr login code ${msg.author.tag}` )
                    msg.author.send(attachment);
                    console.log(`${msg.author.tag} requested a QR`);
                }               
            }
        })
    } else if (command === 'statusof') {
        for(let i=0; i < managerID.length; i++) {
            if(managerID[i] === msg.author.id) {
                if (args[0]) {
                    const user = slicer(args[0]);
                    if (!user) {
                        return msg.reply('Please use a proper mention tag if you want to see someone else game status.');
                    }   
                    scholars.map(async (scholar) => {
                        if(scholar.id === user) {
                            const roninAddress = scholar.roninAddress;
                            const data = await app.getStatus(roninAddress); 
                            if(data === false) {
                                msg.reply('Please Try again');
                            } else {
                                const timestamp = data['last_claimed_item_at'] * 1000
                                const dateOne = new Date(timestamp);
                                const dateTwo = new Date(timestamp + + 12096e5)
                                const options = { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric', 
                                    hour: 'numeric', 
                                    minute: 'numeric', 
                                    second: 'numeric', 
                                    timeZoneName: 'short' };
                                const lastClaimed = dateOne.toLocaleDateString(undefined, options);
                                const claimAt = dateTwo.toLocaleDateString(undefined, options);
                                const currentSLP = data['blockchain_related']['balance']
                                const claimableSLP = data['raw_total'] - data['raw_claimable_total']
                                const embed = new MessageEmbed()
                                    .setAuthor(msg.author.username)
                                    .addField('Currents SLP count: ', currentSLP)
                                    .addField('Claimable SLP: ', claimableSLP)
                                    .addField('Last Claimed Date : ', lastClaimed)
                                    .addField('Next Claim Date: ', claimAt)
                                    .setTimestamp()
                                    .setFooter('Exidz Academy Bot' );  
                                msg.reply(embed);
                                console.log(`Check status of ${user} by ${msg.author.tag}`);
                            }                            
                        } 
                    }) 
                }

            }
            
        }              
    } else if (command === 'price') {
        const slpPrice = await getPrice.slpPrice();
        if (slpPrice === false) {
            return msg.reply('Please try again later')
        } else {
            const embed = new MessageEmbed()
                .setColor('#1E90FF')
                .setTitle("Smooth Love Potion Price")
                .setAuthor(msg.author.username)                
                .addField('1 SLP = ' + slpPrice + ' USD', '\u200B')
                .setTimestamp()
                .setFooter('Coingecko API');                
            msg.reply(embed)
            console.log(msg.author.tag + ' request slp price');
        }
    }
};
