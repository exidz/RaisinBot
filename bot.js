const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config()
const commands = require('./commands.js')
const token = process.env.DISCORD_BOT_TOKEN;
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', commands);

client.login(token);