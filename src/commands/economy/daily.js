import User from "../../models/user.js";
import { Client, MessageFlags } from "discord.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import xp from "../../utils/xp.js";

import replies from "../../utils/core/replies.js";
import discord from "../../configs/discord.json" with { type: "json" };

import cache from "../../cache/daily.js";

const dailyAmount = 1000;
const xpToGive = 10;

export default {
  name: "daily",
  description: "Collect your dailies!",

  /**
   *
   * @param {Client} client
   * @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, "daily");
    const CACHE_REF = `${interaction.guild.id}:${interaction.member.id}`;
    const now = new Date();

    if (!interaction.inGuild()) {
      return replies.message.error(interaction, words.OnlyInsideServer);
    }

    try {
      let query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let dailyHistory = await cache.get(CACHE_REF);

      if (dailyHistory && dailyHistory.found) {

        await interaction.deferReply({
          flags: [MessageFlags.Ephemeral],
        });

        return await replies.message.info(
          interaction,
          words.AlreadyCollected,
          {
            context: discord.replies.edit,
          },
        );
      }

      let user = await User.findOne(query);

      if(!user) user = new User({ ...query, lastDaily: now });

      user.balance += dailyAmount;
      user.lastDaily = now;
      await user.save();

      await xp.give(
        interaction.user,
        interaction.guild,
        interaction.channel,
        xpToGive,
      );

      await cache.set(CACHE_REF, { xp: xpToGive, currentBalance: user.balance, daily: dailyAmount });

      await interaction.deferReply({
        flags: [MessageFlags.Ephemeral],
      });

      return await replies.message.info(
        interaction,
        formatMessage(words.AddedToBalance, [dailyAmount, user.balance]),
        {
          context: discord.replies.edit,
        },
      );
    } catch (e) {
      await replies.message.error(interaction, words.ErrorDaily);
      console.log(`Error with /daily: ${e}`);
    }
  },
};
