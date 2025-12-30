import {
  Client,
  ApplicationCommandOptionType,
  EmbedBuilder,
  Colors,
} from "discord.js";
import { Buffer } from "node:buffer";
import dotenv from "dotenv";

import reply from "../../utils/core/replies.js";
import { getLocalization } from "../../utils/i18n.js";

dotenv.config();

export default {
  name: "sd",
  description: "send a prompt to stable diffusion",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, "sd");

    const imgFormat = "jpeg";
    let prompt = interaction.options.get("prompt")?.value;
    const show = interaction.options.get("show")?.value;

    if (!prompt) {
      return await reply.message.error(interaction, words.ValidInput);
    }

    if (!process.env.STABLE_DIFFUSION_API_KEY) {
      return await reply.message.error(interaction, words.MissingApiKey);
    }

    await reply.message.info(interaction, words.Generating);

    const formData = new FormData();

    formData.append("prompt", prompt);
    formData.append("output_format", imgFormat);

    const response = await fetch(
      `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${process.env.STABLE_DIFFUSION_API_KEY}`,
          Accept: "image/*",
        },
      },
    );

    if (response.status === 200) {
      const embed = new EmbedBuilder()
        .setTitle(`Stable Diffusion image`)
        .setColor(Colors.Blurple)
        .setImage(`attachment://sd.${imgFormat}`)
        .setFooter({
          text: new Date().toDateString(),
          iconURL: interaction.member.displayAvatarURL({ size: 256 }),
        });

      if (show === undefined || show) {
        embed.setDescription(`Prompt: \`${prompt}\``);
      }

      interaction.channel.send({
        embeds: [embed],
        files: [
          {
            attachment: Buffer.from(await response.arrayBuffer()),
            name: `sd.${imgFormat}`,
          },
        ],
      });
    } else {
      console.log(`${response.status}: ${response.text}`);
      interaction.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              `Error generating image: ${response.status}: ${response.text}`,
            )
            .setColor(Colors.Red),
        ],
      });
    }
  },
  options: [
    {
      name: "prompt",
      description: "the prompt you want to generate",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "show",
      description: "wants the return to show the requested prompt",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],
};
