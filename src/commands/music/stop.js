const { Client, Interaction, EmbedBuilder } = require('discord.js');

const { useQueue } = require('discord-player')

module.exports =  {
  name: 'stop',
  description: 'stop the song on the voice channel',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const queue = useQueue(interaction.guild);
    const embed = new EmbedBuilder();

    if (queue.isPlaying()) 
      {
        queue.node.stop();
        await interaction.editReply({ embeds: [embed.setDescription(":rock: Stopped the song! Queue cleaned.")] });
        return; 
      }

      await interaction.editReply({ embeds: [embed.setDescription(":warning: No song are playing right now!")] });
  }

}