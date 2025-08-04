const { Client, Interaction, EmbedBuilder, MessageFlags } = require('discord.js');

const { useQueue } = require('discord-player')

const { getI18n } = require("../../utils/i18n");
const getLocalization = locale => require(`../../i18n/${getI18n(locale)}/resume`);

module.exports =  {
  name: 'resume',
  description: 'resume the paused playback',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    await interaction.deferReply({ flags: [ MessageFlags.Ephemeral ] });

    const words = getLocalization(interaction.locale);

    const queue = useQueue(interaction.guild);
    const embed = new EmbedBuilder();

    if (queue.node.isPlaying()) {
      await interaction.editReply({
        embeds: [embed.setDescription(`:warning: ${words.NotPaused}`)],
      });
      return;
    }

    queue.node.resume();

    await interaction.editReply({
      embeds: [embed.setDescription(`:fire: ${words.Resumed}`)],
    });
  }

}