import { Client, ApplicationCommandOptionType, MessageFlags } from "discord.js";

import { useMainPlayer, useQueue } from "discord-player";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import replies from "../../utils/core/replies.js";

import cache from "../../utils/cache/tts.js";
import guildCache from "../../utils/cache/guild.js";

const OPTS = {
  join: {
    name: "join",
    description: "Join the voice channel with tts",
    type: ApplicationCommandOptionType.Subcommand,
  },
  leave: {
    name: "leave",
    description: "leave the tts voice channel poll",
    type: ApplicationCommandOptionType.Subcommand,
  },
};

export default {
  name: "tts",
  description: "Text-to-Speech command",
  options: [OPTS.join, OPTS.leave],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case OPTS.join.name:
        return await join(client, interaction);
      case OPTS.leave.name:
        return await leave(client, interaction);
      default:
        return await replies.message.error(
          interaction,
          `tts command not found!`,
        );
    }
  },
};

async function join(client, interaction) {
  const channel = interaction.member?.voice?.channel;
  if (!channel) return;

  const CACHE_REF = `${interaction.guild.id}`;
  const ttsCache = cache.get(CACHE_REF);

  if (!ttsCache) {
    const contextEvent = async (message) => await event(client, message);

    client.on("messageCreate", contextEvent);
    cache.set(CACHE_REF, contextEvent);
    cache.addUser(CACHE_REF, interaction.user.id);

    play(channel, " ");
  } else {
    if (cache.includes(CACHE_REF, interaction.user.id)) {
      return await replies.message.info(interaction, `already joined`);
    }

    cache.addUser(CACHE_REF, interaction.user.id);
  }

  return await replies.message.success(interaction, `joined successfully`);
}

async function leave(client, interaction) {
  const CACHE_REF = `${interaction.guild.id}`;

  const ttsCache = cache.get(CACHE_REF);

  if (!ttsCache || !cache.includes(CACHE_REF, interaction.user.id)) {
    return await replies.message.info(interaction, `already leaved`);
  }

  let result = cache.removeUser(CACHE_REF, interaction.user.id);

  if (!result) {
    client.off("messageCreate", ttsCache);
    cache.set(CACHE_REF, null);

    let queue = useQueue(interaction.guild);
    queue.delete();
  }

  return await replies.message.success(
    interaction,
    `left the tts voice channel`,
  );
}

function play(voice, message) {
  const player = useMainPlayer();

  player.play(voice, `tts:${message}`, {
    nodeOptions: {
      leaveOnStop: false,
      pauseOnEmpty: true,
      leaveOnEmpty: false,
      leaveOnEnd: false,
    },
  });
}

async function event(client, message) {
  const TTS_REF = `${message.guildId}`;

  if (message.author.bot || !cache.includes(TTS_REF, message.author.id)) return;

  const GUILD_ID = `${message.guildId}`;

  let guild = guildCache.get(GUILD_ID);

  if (!guild) {
    if (!guildCache.searched(GUILD_ID)) {
      guild = client.guilds.cache.get(message.guildId);
      guildCache.set(GUILD_ID, guild);
    } else return;
  }

  const member = guild.members.cache.get(message.author.id);
  const voice = member?.voice?.channel;

  if (!voice) return;

  play(voice, message.content);
}
