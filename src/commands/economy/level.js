import {
  Client,
  ApplicationCommandOptionType,
  AttachmentBuilder,
  PermissionFlagsBits,
} from "discord.js";
import Level from "../../models/level.js";
import { Font, RankCardBuilder } from "canvacord";
import xp from "../../utils/xp.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import replies from "../../utils/core/replies.js";

export default {
  name: "level",
  description: "Manage your/someone's level",
  options: [
    {
      name: "show",
      description: "shows your/someone's level",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "target",
          description: "The user whose level you want to see.",
          type: ApplicationCommandOptionType.User,
        },
      ],
    },
    {
      name: "give",
      description: "Add XP to a user.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "The user whose xp you want to give.",
          type: ApplicationCommandOptionType.User,
        },
        {
          name: "amount",
          description: "The amount of xp you want to give.",
          type: ApplicationCommandOptionType.Integer,
        },
      ],
    },
  ],

  /**
   *
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "show":
        await show(client, interaction);
        break;
      case "give":
        await give(client, interaction);
        break;
    }
  },
};

async function show(client, interaction) {
  const words = await getLocalization(interaction.locale, `level`);

  if (!interaction.inGuild()) {
    return await replies.message.error(interaction, words.ServerOnly);
  }

  await interaction.deferReply();

  const mentionedUserId = interaction.options.get("target")?.value;
  const targetUserId = mentionedUserId || interaction.member.id;
  const targetUserObj = await interaction.guild.members.fetch(targetUserId);

  const fetchLevel = await Level.findOne({
    userId: targetUserId,
    guildId: interaction.guild.id,
  });

  if (!fetchLevel) {
    return await replies.message.error(
      interaction,
      mentionedUserId
        ? formatMessage(words.UserNoLevels, [targetUserObj.user.tag])
        : words.NoLevels,
      {
        context: "editReply",
      },
    );
  }

  let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
    "-_id userId level xp",
  );

  allLevels.sort((a, b) => {
    if (a.level === b.level) {
      return b.xp - a.xp;
    } else {
      return b.level - a.level;
    }
  });

  Font.loadDefault();

  let currentRank =
    allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;
  const rank = new RankCardBuilder()
    .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
    .setRank(currentRank)
    .setLevel(fetchLevel.level)
    .setCurrentXP(fetchLevel.xp)
    .setRequiredXP(xp.calc(fetchLevel.level))
    .setStatus(targetUserObj.presence.status)
    .setUsername(targetUserObj.user.username);

  const data = await rank.build();
  const attachment = new AttachmentBuilder(data);

  interaction.editReply({ files: [attachment] });
}

async function give(client, interaction) {
  const words = await getLocalization(interaction.locale, `level`);

  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return await reply.message.error(interaction, words.AdminExclusiveCommand);
  }

  const userId =
    interaction.options.get("user")?.value || interaction.member.id;
  const amount = interaction.options.get("amount")?.value || 1;

  const level = await Level.findOne({
    userId,
    guildId: interaction.guild.id,
  });

  let xpToGive;

  if (level) {
    xpToGive = xp.calc(level.level + amount) - level.xp;
  } else {
    xpToGive = xp.calc(amount);
  }

  await xp.give(
    userId,
    interaction.guild.id,
    interaction.channel,
    xpToGive,
    {},
    true,
  );

  await replies.message.success(
    interaction,
    formatMessage(words.SuccessfullyLevel, [amount, userId]),
  );
}
