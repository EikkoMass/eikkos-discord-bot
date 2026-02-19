import {
  ApplicationCommandOptionType,
  Client,
  PermissionFlagsBits,
} from "discord.js";
import DirtyWord from "../../models/dirtyword.js";
import cache from "../../utils/cache/dirty-word.js";

import reply from "../../utils/core/replies.js";
import discord from "../../configs/discord.json" with { type: "json" };
import actions from "../../configs/actions.json" with { type: "json" };

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import getPaginator from "../../utils/components/getPaginator.js";
import getDirtyWordEmbeds from "../../utils/components/getDirtyWordEmbeds.js";

const OPTS = {
  list: {
    name: "list",
    description: "current word registered on this guild",
    type: ApplicationCommandOptionType.Subcommand,
  },
  register: {
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
  remove: {
    name: "remove",
    description: "remove the word",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "id",
        description: "id of the word register",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
};

export default {
  name: "dirty-word",
  description: "Sets an word to auto-ban the user who write.",
  options: [OPTS.list, OPTS.register, OPTS.remove],

  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],

  /**
   *
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case OPTS.list.name:
        return await list(client, interaction);
      case OPTS.register.name:
        return await register(client, interaction);
      case OPTS.remove.name:
        return await remove(client, interaction);
      default:
        return await reply.message.error(
          interaction,
          `Dirty Word command not found!`,
        );
    }
  },
};

async function remove(client, interaction) {
  const words = await getLocalization(interaction.locale, "dirty-word");
  const CACHE_REF = `${interaction.guild.id}`;

  const id = interaction.options.get("id").value;

  let dWord = await DirtyWord.findById(id);

  if (dWord && interaction.guild.id === dWord.guildId) {
    cache.removeWord(CACHE_REF, dWord);
    await DirtyWord.deleteOne({ _id: dWord._id });
    return await reply.message.success(interaction, words.Removed);
  }

  await reply.message.info(interaction, words.NotFound);
}

async function list(client, interaction) {
  const words = await getLocalization(interaction.locale, "dirty-word");

  const page = 1;
  const query = { guildId: interaction.guild.id };

  const count = await DirtyWord.countDocuments(query);
  const dWords = await DirtyWord.find(query)
    .sort({ _id: -1 })
    .skip((page - 1) * discord.embeds.max)
    .limit(discord.embeds.max);

  if (!dWords || dWords.length === 0) {
    return await reply.message.error(interaction, words.NotFound);
  }

  return await interaction.reply({
    embeds: await getDirtyWordEmbeds(client, dWords),
    components: [
      getPaginator(
        {
          id: actions.dirtyword.list,
        },
        count,
        page,
        discord.embeds.max,
      ),
    ],
  });
}

async function register(client, interaction) {
  const words = await getLocalization(interaction.locale, `dirty-word`);
  const CACHE_REF = `${interaction.guild.id}`;

  const word = interaction.options.get("word")?.value;
  const type = interaction.options.get("type")?.value || 0;

  let dirtyWordObj = await DirtyWord.findOne({
    guildId: interaction.guild.id,
    word,
    type,
  });

  if (dirtyWordObj) {
    return await reply.message.error(interaction, words.AlreadyExists);
  } else {
    dirtyWordObj = new DirtyWord({
      guildId: interaction.guild.id,
      word,
      type,
      creationDate: new Date(),
    });

    await dirtyWordObj.save();

    cache.addWord(CACHE_REF, dirtyWordObj);
    return await reply.message.success(interaction, words.Created);
  }
}
