require('dotenv').config();
const { Client, GatewayIntentBits } = require("discord.js");
const eventHandler = require('./handlers/eventHandler');
const mongoose = require('mongoose');

const client = 
new Client(
  { 
    intents: [
                  GatewayIntentBits.Guilds,
                  GatewayIntentBits.GuildMembers, 
                  GatewayIntentBits.GuildMessages, 
                  GatewayIntentBits.GuildMessagePolls, 
                  GatewayIntentBits.GuildPresences, 
                  GatewayIntentBits.GuildIntegrations, 
                  GatewayIntentBits.MessageContent,
              ] 
    }
);

(async () => {
try{
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
} catch (e) {
  console.log(e);
}

eventHandler(client);
client.login(process.env.DISCORD_TOKEN);
})();

/*
client.on("messageCreate", async (message) => {
  if(message.author.bot) return;
    // message.reply("Hello");
});
*/


