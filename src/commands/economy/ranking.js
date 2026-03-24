import { EmbedBuilder, Client, MessageFlags } from "discord.js";
import Level from "../../models/level.js";
import { getLocalization } from "../../utils/i18n.js";

import replies from "../../utils/core/replies.js";
import discord from "../../configs/discord.json" with { type: "json" };

const QUANTITY_OF_USERS = 5;

export default {
  name: "ranking",
  description: `Show the top ${QUANTITY_OF_USERS} users on the ranking`,
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `ranking`);

    if (!interaction.inGuild()) {
      return await replies.message.error(interaction, words.ServerOnly);
    }

    const rankedUsers = await Level.find({ guildId: interaction.guild.id })
      .limit(QUANTITY_OF_USERS)
      .sort({
        level: -1,
        xp: -1,
      });

    if (!rankedUsers?.length) {
      return await replies.message.error(interaction, words.UserNotFound);
    }

    const embeds = [];

    for (let i = 0; i < rankedUsers.length; i++) {
      try {
        const user = await interaction.guild.members.fetch(
          rankedUsers[i].userId,
        );

        embeds.push(buildUserEmbed(words, true, rankedUsers[i], i, user));
        continue;
      } catch (noGuildMemberFound) {
        // console.log('not a guild member anymore')
      }

      try {
        const user = await client.users.fetch(rankedUsers[i].userId, {
          force: true,
          cache: true,
        });

        embeds.push(buildUserEmbed(words, false, rankedUsers[i], i, user));
        continue;
      } catch (noGuildMemberFound) {
        // console.log('not a discord user anymore')
      }

      embeds.push(
        new EmbedBuilder()
          .setTitle(`${i === 0 ? "👑" : i + 1} ${words.Undefined}`)
          .setFields([
            { name: words.Level, value: `${rankedUsers[i].level}` },
            { name: words.XP, value: `${rankedUsers[i].xp}` },
          ])
          .setURL(`https://discord.com/users/${rankedUsers[i].userId}`)
          .setThumbnail(
            "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",
          )
          .setColor([
            255 - i * (10 * QUANTITY_OF_USERS),
            255 - i * (5 * QUANTITY_OF_USERS),
            0,
          ]),
      );
    }

    interaction.reply({
      embeds,
    });
  },
};

function buildUserEmbed(words, isGuildMember, userRank, rank, user) {
  const userFields = [
    { name: words.Level, value: `${userRank.level}` },
    { name: words.XP, value: `${userRank.xp}` },
    {
      name: `🌐 ${words.Joined}`,
      value: isGuildMember ? user.joinedAt.toDateString() : words.UserNotFound,
    },
  ];

  return new EmbedBuilder()
    .setTitle(
      `[ ${rank === 0 ? "👑" : rank + 1} ] ${user.displayName || user.nickname}`,
    )
    .setThumbnail(user.displayAvatarURL({ size: discord.avatar.size.medium }))
    .setFields(userFields)
    .setURL(`https://discord.com/users/${userRank.userId}`)
    .setColor([
      255 - rank * (10 * QUANTITY_OF_USERS),
      255 - rank * (5 * QUANTITY_OF_USERS),
      0,
    ]);
}
