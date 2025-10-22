import dotenv from "dotenv";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import eventHandler from "./handlers/eventHandler.js";
import mongoose from "mongoose";
import { Player } from "discord-player";
import { DefaultExtractors } from "@discord-player/extractor";
import { YoutubeiExtractor } from "discord-player-youtubei";
import authenticateOnIGDB from "./utils/authenticators/igdbAuth.js";
import loadPlayerEvents from "./utils/importers/loadPlayerEvents.js";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessagePolls,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.User, Partials.Reaction, Partials.Message],
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");
  } catch (e) {
    console.log(e);
  }

  const player = new Player(client);

  await player.extractors.register(YoutubeiExtractor, {
    authentication: process.env.YT_CREDENTIAL,
  });

  await player.extractors.loadMulti(DefaultExtractors);
  await loadPlayerEvents(player.events);

  // IGDB
  if (!process.env.IGDB_CLIENT_ID || !process.env.IGDB_CLIENT_SECRET) {
    console.log(`Missing IGDB credentials, skipping authentication!`);
  } else {
    await authenticateOnIGDB(client);
  }

  eventHandler(client);
  client.login(process.env.DISCORD_TOKEN);
})();
