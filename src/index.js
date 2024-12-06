require('dotenv').config();
const { Client, GatewayIntentBits } = require("discord.js");
const eventHandler = require('./handlers/eventHandler');
const mongoose = require('mongoose');
const { Player } = require('discord-player');
const { YoutubeiExtractor } = require("discord-player-youtubei");

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

const player = new Player(client);

await player.extractors.register(YoutubeiExtractor, {
  authentication: process.env.YT_CREDENTIAL
});

await player.extractors.loadDefault(
  (ext) => !["YouTubeExtractor"].includes(ext)
);

eventHandler(client);
client.login(process.env.DISCORD_TOKEN);
})();


