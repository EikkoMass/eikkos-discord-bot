require('dotenv').config();
const { Client, GatewayIntentBits } = require("discord.js");
const eventHandler = require('./handlers/eventHandler');
const mongoose = require('mongoose');
const { Player } = require('discord-player');

const client = 
new Client(
  { 
    intents: [
                  GatewayIntentBits.Guilds,
                  GatewayIntentBits.GuildMembers, 
                  GatewayIntentBits.GuildMessages, 
                  GatewayIntentBits.GuildVoiceStates,
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

client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
  }
});

client.player.extractors.loadDefault();

eventHandler(client);
client.login(process.env.DISCORD_TOKEN);
})();

/*
client.on("messageCreate", async (message) => {
  if(message.author.bot) return;
    // message.reply("Hello");
});
*/


