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
    await interaction.deferReply();

    const queue = useQueue(interaction.guild);
    const embed = new EmbedBuilder();

    if (queue.node.isPlaying()) {
      await interaction.editReply({
        ephemeral: true,
        embeds: [embed.setDescription("The playback is not paused.")],
      });
      return;
    }

    queue.node.resume();

    await interaction.editReply({
      embeds: [embed.setDescription("Resumed the playback.")],
    });
  }

}