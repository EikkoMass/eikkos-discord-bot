const { Client, Interaction, EmbedBuilder } = require('discord.js');

const { useQueue } = require('discord-player')

module.exports =  {
  name: 'resume',
  description: 'resume the paused playback',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const queue = useQueue(interaction.guild);
    const embed = new EmbedBuilder();

    if (queue.node.isPlaying()) {
      await interaction.editReply({
        embeds: [embed.setDescription(":warning: The playback is not paused.")],
      });
      return;
    }

    queue.node.resume();

    await interaction.editReply({
      embeds: [embed.setDescription(":fire: Playback resumed.")],
    });
  }

}