import {
  Client,
  ApplicationCommandOptionType,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";

import reply from "../../utils/core/replies.js";
import { getLocalization } from "../../utils/i18n.js";

export default {
  name: "yesno",
  description: "make a question of yes / no to the bot",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    interaction.reply("meu teste 123", { tts: true });
    return;
    const words = await getLocalization(interaction.locale, `yesno`);

    let question = interaction.options.get("doubt")?.value;

    if (!question?.includes("?")) {
      return await reply.message.error(interaction, words.NoQuestionMark);
    }

    const res = await fetch("https://yesno.wtf/api");

    if (res.ok) {
      const json = await res.json();

      const embed = new EmbedBuilder()
        .setImage(json.image)
        .setDescription(question)
        .setFooter({
          text: new Date().toDateString(),
          iconURL: interaction.member.displayAvatarURL({ size: 256 }),
        });

      interaction.reply({
        embeds: [embed],
      });
      return;
    }

    await reply.message.error(interaction, words.NotAnswering);
  },
  options: [
    {
      name: "doubt",
      description: "the question you want to do",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};
