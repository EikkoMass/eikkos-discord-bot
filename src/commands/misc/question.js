import { Client, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

import { getLocalization } from "../../utils/i18n.js";
import emojis from "../../utils/core/emojis.js";

export default {
  name: "question",
  description: "Create a question with emoji voting",

  /**
   *
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, "question");
    const text = interaction.options.get("text").value;

    await interaction.deferReply();
    await interaction.deleteReply();

    const message = await interaction.channel.send({
      embeds: [
        new EmbedBuilder()
          .setFields([
            { name: words.Requester, value: `<@${interaction.member.id}>` },
          ])
          .setTitle(text),
      ],
    });

    await message.react(emojis.get("upvote", "👍"));
    await message.react(emojis.get("downvote", "👎"));
  },

  options: [
    {
      name: "text",
      description: "What you want to ask?",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};
