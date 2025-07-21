const { Client, Interaction, EmbedBuilder, MessageFlags } = require('discord.js');

const { useQueue } = require('discord-player')

const { getI18n } = require("../../utils/i18n");
const getLocalization = locale => require(`../../i18n/${getI18n(locale)}/stop`);

module.exports =  {
  name: 'stop',
  description: 'stop the song on the voice channel',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    const words = getLocalization(interaction.locale);

    await interaction.deferReply({ flags: [ MessageFlags.Ephemeral ] });

    const queue = useQueue(interaction.guild);
    const embed = new EmbedBuilder();

    if (queue.isPlaying()) 
    {
      queue.node.stop();
      await interaction.editReply({ embeds: [embed.setDescription(`:rock: ${words.Stopped}`)] });
      return; 
    }

      await interaction.editReply({ embeds: [embed.setDescription(`:warning: ${words.NoSongPlaying}`)] });
  }

}