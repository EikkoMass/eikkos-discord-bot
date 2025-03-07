require('dotenv').config();
const { Client, GatewayIntentBits } = require("discord.js");
const eventHandler = require('./handlers/eventHandler');
const mongoose = require('mongoose');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const { YoutubeiExtractor } = require("discord-player-youtubei");
const authenticateOnIGDB = require('./utils/igdbAuth');
const loadPlayerEvents = require('./utils/loadPlayerEvents');

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

await player.extractors.loadMulti(DefaultExtractors);
loadPlayerEvents(player.events);

client.dirtyWordCache = {
  search: [],
  result: []
};

// IGDB


if(!process.env.IGDB_CLIENT_ID || !process.env.IGDB_CLIENT_SECRET)
{
  console.log(`Missing IGDB credentials, skipping authentication!`);
} else {
  await authenticateOnIGDB(client);
}

eventHandler(client);
client.login(process.env.DISCORD_TOKEN);
})();


