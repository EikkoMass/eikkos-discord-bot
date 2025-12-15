import { Client, ApplicationCommandOptionType } from "discord.js";
import replies from "../../utils/core/replies.js";

export default {
  name: "server",
  description: "commands about your server",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "image":
        await image(client, interaction);
        break;
      default:
        return await reply.message.error(
          interaction,
          `Server command not found!`,
        );
    }
  },

  options: [
    {
      name: "image",
      description: "image from your server",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
};

async function image(client, interaction) {
  const guild = interaction.guild;

  if (!guild)
    return await replies.message.error(
      interaction,
      "Server not found! (How did this happen?)",
    );

  const image = guild.iconURL({ size: 1024 });

  if (!image)
    return await replies.message.error(interaction, "Server icon not found!");

  await interaction.reply({ files: [image] });
}
