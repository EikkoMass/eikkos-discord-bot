const { Client, Interaction, EmbedBuilder } = require('discord.js');

const { useQueue } = require('discord-player');
const { getI18n } = require("../../utils/i18n");
const getLocalization = locale => require(`../../i18n/${getI18n(locale)}/pause`);

module.exports =  {
  name: 'pause',
  description: 'pause the song on the voice channel',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    
    const words = getLocalization(interaction.locale);

    await interaction.deferReply({ ephemeral: true });

    const queue = useQueue(interaction.guild);
    const embed = new EmbedBuilder();

    if(!queue?.node)
    {
      await interaction.editReply({
        embeds: [embed.setDescription(":x: " + words.NoQueue)],
      });
      return;
    }

    if (queue.node.isPaused()) {
      await interaction.editReply({
        embeds: [embed.setDescription(":warning: " + words.AlreadyPaused)],
      });
      return;
    }

    queue.node.pause();

    await interaction.editReply({
      embeds: [embed.setDescription(":ice_cube: " + words.Paused)],
    });
  }

}