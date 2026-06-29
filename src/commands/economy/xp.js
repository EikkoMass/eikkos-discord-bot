import {
  Client,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} from "discord.js";
import xp from "../../utils/xp.js";
import masks from "../../utils/core/mask.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import replies from "../../utils/core/replies.js";

import Level from "../../models/level.js";
import cache from "../../utils/cache/level.js";

import { validator as hasFlag } from "../../utils/core/flags.js";

const OPTS = {
  give: {
    name: "give",
    description: "Add XP to a user.",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "user",
        description: "The user whose xp you want to give.",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "amount",
        description: "The amount of xp you want to give.",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
  },
  show: {
    name: "show",
    description: "shows your/someone's xp",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "target",
        description: "The user whose xp you want to see.",
        type: ApplicationCommandOptionType.User,
      },
    ],
  },
};

export default {
  name: "xp",
  devOnly: true,
  description: "Manage guild's xp",
  options: [OPTS.give, OPTS.show],

  /**
   *
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case OPTS.give.name:
        return await give(client, interaction);
      case OPTS.show.name:
        return await show(client, interaction);
    }
  },
};

async function give(client, interaction) {
  const words = await getLocalization(interaction.locale, `xp`);

  let userId = interaction.options.get("user")?.value || interaction.member.id;
  let amount = interaction.options.get("amount")?.value || 100;

  if (!hasFlag(PermissionFlagsBits.Administrator, interaction.member)) {
    return await reply.message.error(interaction, words.AdminExclusiveCommand);
  }

  await xp.give(
    userId,
    interaction.guild.id,
    interaction.channel,
    amount,
    {},
    true,
  );

  await replies.message.success(
    interaction,
    formatMessage(words.SuccessfullyXP, [amount, masks.user(userId)]),
  );
}

async function show(client, interaction) {
  const words = await getLocalization(interaction.locale, `xp`);

  let userId =
    interaction.options.get("target")?.value || interaction.member.id;
  const guildId = interaction.guild.id;
  const CACHE_REF = `${guildId}${userId}`;

  let level = await cache.get(CACHE_REF);

  if (level === null) {
    level = await Level.findOne({ guildId, userId });

    if (!level) {
      return await replies.message.error(interaction, words.NoLevelFound);
    }

    await cache.set(CACHE_REF, level);
  } else if (!level.found) {
    return await replies.message.error(interaction, words.NoLevelFound);
  } else {
    level = Level.hydrate(level.value);
  }

  const userXp = level.xp;

  await replies.message.success(
    interaction,
    formatMessage(words.CurrentXP, [masks.user(userId), userXp]),
  );
}
