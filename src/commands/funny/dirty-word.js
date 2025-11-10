import {
  ApplicationCommandOptionType,
  Client,
  MessageFlags,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";
import DirtyWord from "../../models/dirtyword.js";
import cache from "../../utils/cache/dirty-word.js";

import reply from "../../utils/core/replies.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";

export default {
  /**
   *
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "current":
        await getCurrentDirtyWord(client, interaction);
        break;
      case "register":
        await setDirtyWord(client, interaction);
        break;
      case "remove":
        await removeDirtyWord(client, interaction);
        break;
      default:
        await interaction.reply({
          flags: [MessageFlags.Ephemeral],
          content: `Dirty Word command not found!`,
        });
        return;
    }
  },
  options: [
    {
      name: "current",
      description: "current word registered on this guild",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "register",
      description: "register an bad word on this guild",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "word",
          description: "bad word",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "type",
          description: "How you can identify the word?",
          type: ApplicationCommandOptionType.Integer,
          autocomplete: true,
        },
      ],
    },
    {
      name: "remove",
      description: "remove the word",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  name: "dirty-word",
  description: "Sets an word to auto-ban the user who write.",
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],
};

async function removeDirtyWord(client, interaction) {
  const words = await getLocalization(interaction.locale, "dirty-word");
  const embed = new EmbedBuilder();

  let indexes = cache.index.find(interaction.guild.id);

  if (indexes.result > -1) cache.result.index.remove(indexes.result);
  if (indexes.search > -1) cache.search.index.remove(indexes.search);

  let dirtyWord = await DirtyWord.findOneAndDelete({
    guildId: interaction.guild.id,
  });

  if (dirtyWord) {
    await reply.message.success(interaction, words.Removed);
    return;
  }

  await reply.message.info(interaction, words.NotFound);
}

async function getCurrentDirtyWord(client, interaction) {
  const words = await getLocalization(interaction.locale, "dirty-word");

  const cacheObj = cache.result.find(interaction.guild.id);

  const dirtyWordObj =
    cacheObj || (await DirtyWord.findOne({ guildId: interaction.guild.id }));

  if (dirtyWordObj) {
    const word = dirtyWordObj.word;
    const censoredWord =
      word.length > 1
        ? word.slice(0, word.length / 2) + "*".repeat(word.length / 2)
        : word;

    await reply.message.success(
      interaction,
      formatMessage(words.CurrentWord, [censoredWord]),
    );
    return;
  }

  await reply.message.info(interaction, words.NotFound);
}

async function setDirtyWord(client, interaction) {
  const words = await getLocalization(interaction.locale, `dirty-word`);

  const word = interaction.options.get("word")?.value;
  const type = interaction.options.get("type")?.value || 0;

  let dirtyWordObj = await DirtyWord.findOne({ guildId: interaction.guild.id });

  if (dirtyWordObj) {
    dirtyWordObj.word = word;
    dirtyWordObj.type = type;
    let index = cache.result.update(interaction.guild.id, {
      word,
      type,
    });
  } else {
    const newDirtyWord = { guildId: interaction.guild.id, word, type };

    dirtyWordObj = new DirtyWord(newDirtyWord);
    cache.result.add(newDirtyWord);
  }

  dirtyWordObj.save();
  await reply.message.success(interaction, words.Created);
}
