import { Client, ApplicationCommandOptionType, ChannelType } from "discord.js";

import { useMainPlayer, useQueue } from "discord-player";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import replies from "../../utils/core/replies.js";

import Tts from "../../models/tts.js";

import sessionCache from "../../utils/cache/ttsSession.js";
import ttsCache from "../../utils/cache/tts.js";
import guildCache from "../../utils/cache/guild.js";

const OPTS = {
  join: {
    name: "join",
    description: "Join the voice channel with tts",
    type: ApplicationCommandOptionType.Subcommand,
  },
  channel: {
    name: "channel",
    description: "set the text channel you want to chat with tts",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "id",
        description: "the channel you want",
        type: ApplicationCommandOptionType.Channel,
        channelTypes: [ChannelType.GuildText],
        required: true,
      },
    ],
  },
  leave: {
    name: "leave",
    description: "leave the tts voice channel poll",
    type: ApplicationCommandOptionType.Subcommand,
  },
  shutdown: {
    name: "shutdown",
    description: "force the tts session to end",
    type: ApplicationCommandOptionType.Subcommand,
  },
};

export default {
  name: "tts",
  description: "Text-to-Speech command",
  options: [OPTS.join, OPTS.channel, OPTS.leave, OPTS.shutdown],

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
      case OPTS.shutdown.name:
        return await shutdown(client, interaction);
      case OPTS.channel.name:
        return await channel(client, interaction);
      default:
        return await replies.message.error(
          interaction,
          `tts command not found!`,
        );
    }
  },
};

async function join(client, interaction) {
  const vc = interaction.member?.voice?.channel;
  if (!vc)
    return await replies.message.info(
      interaction,
      `you need to be in a voice channel`,
    );

  const CACHE_REF = `${interaction.guild.id}`;
  const session = sessionCache.get(CACHE_REF);
  let tts = ttsCache.get(CACHE_REF);

  if (!tts && !ttsCache.searched(CACHE_REF)) {
    tts = await Tts.findOne({ guildId: CACHE_REF });
    ttsCache.set(CACHE_REF, tts);
  }

  if (!tts) {
    return await replies.message.error(
      interaction,
      `configuration of guild's tts required`,
    );
  }

  if (!session) {
    const contextEvent = async (message) => await event(client, message);

    client.on("messageCreate", contextEvent);
    sessionCache.set(CACHE_REF, contextEvent, [interaction.user.id]);

    play(
      vc,
      " ",
      interaction.guild.channels.cache.get(tts.channelId),
      interaction.guild.locale,
    );
  } else {
    if (sessionCache.includes(CACHE_REF, interaction.user.id)) {
      return await replies.message.info(interaction, `already joined`);
    }

    sessionCache.addUser(CACHE_REF, interaction.user.id);
  }

  return await replies.message.success(interaction, `joined successfully`);
}

async function leave(client, interaction) {
  const CACHE_REF = `${interaction.guild.id}`;

  const session = sessionCache.get(CACHE_REF);

  if (!session || !sessionCache.includes(CACHE_REF, interaction.user.id)) {
    return await replies.message.info(interaction, `already leaved`);
  }

  let result = sessionCache.removeUser(CACHE_REF, interaction.user.id);

  if (!result) {
    client.off("messageCreate", session.event);
    sessionCache.resetOne(CACHE_REF);

    let queue = useQueue(interaction.guild);
    queue.delete();
  }

  return await replies.message.success(
    interaction,
    `left the tts voice channel`,
  );
}

function play(voice, message, channel, locale) {
  const player = useMainPlayer();

  player.play(voice, `tts:${message}`, {
    nodeOptions: {
      metadata: {
        channel: channel,
        preferredLocale: locale,
      },
      leaveOnStop: false,
      pauseOnEmpty: true,
      leaveOnEmpty: false,
      leaveOnEnd: false,
    },
  });
}

async function event(client, message) {
  const TTS_REF = `${message.guildId}`;

  let tts = ttsCache.get(TTS_REF);

  if (!tts && !ttsCache.searched(TTS_REF)) {
    tts = await Tts.findOne({ guildId: TTS_REF });
    ttsCache.set(TTS_REF, tts);
  }
  if (!tts) return;
  if (tts.channelId !== message.channelId) return;

  if (message.author.bot || !sessionCache.includes(TTS_REF, message.author.id))
    return;

  const GUILD_ID = `${message.guildId}`;

  let guild = guildCache.get(GUILD_ID);

  if (!guild && !guildCache.searched(GUILD_ID)) {
    guild = client.guilds.cache.get(message.guildId);
    guildCache.set(GUILD_ID, guild);
  }

  if (!guild) return;

  const member = guild.members.cache.get(message.author.id);
  const voice = member?.voice?.channel;

  if (!voice) return;

  play(
    voice,
    message.content,
    guild.channels.cache.get(tts.channelId),
    guild.preferredLocale,
  );
}

async function channel(client, interaction) {
  const CACHE_REF = `${interaction.guild.id}`;
  const channel = interaction.options.get("id").value;

  let tts = await Tts.findOne({ guildId: CACHE_REF });

  if (tts) {
    tts.channelId = channel;
    tts.active = true;
  } else {
    tts = new Tts({
      guildId: interaction.guild.id,
      channelId: channel,
      active: true,
    });
  }

  await tts.save();

  ttsCache.set(CACHE_REF, tts);
  return await replies.message.success(
    interaction,
    `changed channel to <#${channel}>`,
  );
}

async function shutdown(client, interaction) {
  const CACHE_REF = `${interaction.guild.id}`;

  let session = sessionCache.get(CACHE_REF);

  if (!session) {
    return await replies.message.error(interaction, `no active session found`);
  }

  client.off("messageCreate", session.event);
  sessionCache.resetOne(CACHE_REF);

  let queue = useQueue(interaction.guild);
  queue.delete();

  return await replies.message.success(
    interaction,
    `shutdown the tts session successfully`,
  );
}
