import { Client, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import replies from "../../utils/core/replies.js";

import { getLocalization } from "../../utils/i18n.js";

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
  const words = await getLocalization(interaction.locale, `server`);
  const guild = interaction.guild;

  const image = guild.iconURL({ size: 1024 });

  if (!image)
    return await replies.message.error(interaction, words.IconNotFound);

  await interaction.reply({ files: [image] });
}

async function info(client, interaction) {
  const words = await getLocalization(interaction.locale, `server`);
  const guild = interaction.guild;

  const embed = new EmbedBuilder()
    .setTitle(guild.name)
    .setFields([
      { name: words.Members, value: `${guild.memberCount}`, inline: true },
      {
        name: words.Events,
        value: `${guild.scheduledEvents.cache.size}`,
        inline: true,
      },
      { name: " ", value: ` ` },
      { name: words.Owner, value: `<@${guild.ownerId}>`, inline: true },
      { name: words.Locale, value: `${guild.preferredLocale}`, inline: true },
    ])
    .setThumbnail(guild.iconURL({ size: 1024 }));

  await interaction.reply({ embeds: [embed] });
}
