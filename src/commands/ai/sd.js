import {
  Client,
  ApplicationCommandOptionType,
  MessageFlags,
  EmbedBuilder,
  Colors,
} from "discord.js";
import { Buffer } from "node:buffer";
import dotenv from "dotenv";

dotenv.config();

export default {
  name: "sd",
  description: "send a prompt to stable diffusion",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const imgFormat = "jpeg";
    let prompt = interaction.options.get("prompt")?.value;

    if (!prompt) {
      interaction.reply({
        flags: [MessageFlags.Ephemeral],
        content: "You need to send an valid input",
      });
      return;
    }

    if (!process.env.STABLE_DIFFUSION_API_KEY) {
      interaction.reply({
        flags: [MessageFlags.Ephemeral],
        content: "Missing API key",
      });
      return;
    }

    interaction.reply({
      flags: [MessageFlags.Ephemeral],
      content: `Generating the image, please wait!`,
    });

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
        .setDescription(`Prompt: \`${prompt}\``)
        .setColor(Colors.Blurple)
        .setImage(`attachment://sd.${imgFormat}`)
        .setFooter({
          text: new Date().toDateString(),
          iconURL: interaction.member.displayAvatarURL({ size: 256 }),
        });

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
  ],
};
