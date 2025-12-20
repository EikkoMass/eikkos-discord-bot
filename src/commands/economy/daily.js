import User from "../../models/user.js";
import { Client, MessageFlags } from "discord.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";

import replies from "../../utils/core/replies.js";

const dailyAmount = 1000;

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

    if (!interaction.inGuild()) {
      return replies.message.error(interaction, words.OnlyInsideServer);
    }

    try {
      await interaction.deferReply({
        flags: [MessageFlags.Ephemeral],
      });

      let query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);

      if (user) {
        const lastDailyDate = user.lastDaily.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          return await replies.message.info(
            interaction,
            words.AlreadyCollected,
            {
              context: "editReply",
            },
          );
        }

        user.lastDaily = new Date();
      } else {
        user = new User({ ...query, lastDaily: new Date() });
      }

      user.balance += dailyAmount;
      await user.save();

      return await replies.message.info(
        interaction,
        formatMessage(words.AddedToBalance, [dailyAmount, user.balance]),
        {
          context: "editReply",
        },
      );
    } catch (e) {
      await replies.message.error(interaction, `Error with /daily`);
      console.log(`Error with /daily: ${e}`);
    }
  },
};
