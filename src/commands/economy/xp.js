import { Client, ApplicationCommandOptionType } from "discord.js";
import xp from "../../utils/xp.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import replies from "../../utils/core/replies.js";

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
};

export default {
  name: "xp",
  devOnly: true,
  description: "Manage guild's xp",
  options: [OPTS.give],

  /**
   *
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case OPTS.give.name:
        await give(client, interaction);
        break;
    }
  },
};

async function give(client, interaction) {
  const words = await getLocalization(interaction.locale, `xp`);

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

  await replies.message.success(
    interaction,
    formatMessage(words.SuccessfullyXP, [amount, userId]),
  );
}
