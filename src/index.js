import dotenv from "dotenv";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import eventHandler from "./handlers/main.js";
import mongoose from "mongoose";
import { Player } from "discord-player";
import { DefaultExtractors } from "@discord-player/extractor";
//import { YoutubeiExtractor as YoutubeExtractor } from "discord-player-youtubei";
import { YoutubeSabrExtractor as YoutubeExtractor } from "discord-player-googlevideo";
import { TTSExtractor } from "discord-player-tts";
import igdb from "./utils/authenticators/igdb.js";
import loadPlayerEvents from "./utils/importers/loadPlayerEvents.js";
import valkey from "./utils/authenticators/valkey.js";

dotenv.config({ quiet: true });

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
    if (!process.env.MONGODB_URI)
      throw new Error("Missing MongoDB URI, required to use the bot");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");
  } catch (e) {
    console.log(e);
  }

  try {
    if (!process.env.VALKEY_HOST || !process.env.VALKEY_PORT)
      throw new Error("Missing Valkey host/port, required to use the bot");

    let valkeyRes = await valkey.actions.connect();

    if (valkeyRes.success) {
      console.log("Connected to Valkey");
    } else {
      throw new Error(`Failed to connect to Valkey: ${valkeyRes.error}`);
    }
  } catch (e) {
    console.log(e);
  }

  const player = new Player(client);

  await player.extractors.register(YoutubeExtractor, {
    authentication: process.env.YT_CREDENTIAL,
  });

  await player.extractors.register(TTSExtractor);

  await player.extractors.loadMulti(DefaultExtractors);
  await loadPlayerEvents(player.events);

  // IGDB
  if (!process.env.IGDB_CLIENT_ID || !process.env.IGDB_CLIENT_SECRET) {
    console.log(`Missing IGDB credentials, skipping authentication!`);
  } else {
    await igdb.getToken();
  }

  eventHandler(client);
  client.login(process.env.DISCORD_TOKEN);
})();
