import { Client, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
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
        return await image(client, interaction);
      case "info":
        return await info(client, interaction);
      default:
        return await replies.message.error(
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
    {
      name: "info",
      description: "info about your server",
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

async function info(client, interaction) {
  const guild = interaction.guild;

  const embed = new EmbedBuilder()
    .setTitle(guild.name)
    .setFields([
      { name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
      { name: "Members", value: `${guild.memberCount}`, inline: true },
      { name: " ", value: ` ` },
      {
        name: "Events",
        value: `${guild.scheduledEvents.cache.size}`,
        inline: true,
      },
      { name: "Locale", value: `${guild.preferredLocale}`, inline: true },
    ])
    .setThumbnail(guild.iconURL({ size: 1024 }));

  await interaction.reply({ embeds: [embed] });
}
