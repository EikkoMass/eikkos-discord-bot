import { Client, ApplicationCommandOptionType } from "discord.js";
import xp from "../../utils/xp.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import replies from "../../utils/core/replies.js";

export default {
  name: "xp",
  devOnly: true,
  description: "Manage guild's xp",
  options: [
    {
      name: "give",
      description: "The user whose level you want to see.",
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
  ],

  /**
   *
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "give":
        await give(client, interaction);
        break;
    }
  },
};

async function give(client, interaction) {
  let userId = interaction.options.get("user")?.value || interaction.member.id;
  let amount = interaction.options.get("amount")?.value || 100;

  await xp.give(
    userId,
    interaction.guild.id,
    interaction.channel,
    amount,
    {},
    true,
  );

  replies.message.success(
    interaction,
    `Successfully gave ${amount} XP to <@${userId}>`,
  );
}
