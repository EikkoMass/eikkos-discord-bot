import { Client, ApplicationCommandOptionType, MessageFlags } from "discord.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export default {
  name: "dalle",
  description: "send a prompt to openai's dalle",
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
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const px = 1024;
    const prompt = interaction.options.get("prompt")?.value;
    const show = interaction.options.get("show")?.value;

    if (!prompt) {
      interaction.reply({
        flags: [MessageFlags.Ephemeral],
        content: "You need to send an valid input",
      });
      return;
    }

    if (!process.env.OPENAI_API_KEY) {
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

    const response = await new OpenAI({
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    }).images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: `${px}x${px}`,
    });

    if (response) {
      const embed = new EmbedBuilder()
        .setTitle(`OpenAI generated image`)
        .setColor(Colors.Blurple)
        .setImage(response.data[0].url)
        .setFooter({
          text: new Date().toDateString(),
          iconURL: interaction.member.displayAvatarURL({ size: 256 }),
        });

      if (show === undefined || show) {
        embed.setDescription(`Prompt: \`${prompt}\``);
      }

      interaction.channel.send({
        embeds: [embed],
      });
    } else {
      console.log(response);
    }
  },
};
