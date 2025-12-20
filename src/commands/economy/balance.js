import { ApplicationCommandOptionType, Client } from "discord.js";
import User from "../../models/user.js";

import replies from "../../utils/core/replies.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";

export default {
  name: "balance",
  description: "See yours/someone else's balance",
  options: [
    {
      name: "user",
      description: "The user whose balance you want to get",
      type: ApplicationCommandOptionType.User,
    },
  ],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `balance`);

    if (!interaction.inGuild()) {
      return await replies.message.error(interaction, words.ServerOnly);
    }

    const targetUserId =
      interaction.options.get("user")?.value || interaction.member.id;

    const user = await User.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!user) {
      return await replies.message.error(
        interaction,
        formatMessage(words.UserNoProfile, [targetUserId]),
      );
    }

    return await replies.message.info(
      interaction,
      targetUserId === interaction.member.id
        ? formatMessage(words.Balance, [user.balance])
        : formatMessage(words.UserBalance, [targetUserId, user.balance]),
    );
  },
};
