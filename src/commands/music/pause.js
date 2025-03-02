const { Client, Interaction, EmbedBuilder } = require('discord.js');

const { useQueue } = require('discord-player')

module.exports =  {
  name: 'pause',
  description: 'pause the song on the voice channel',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const queue = useQueue(interaction.guild);
    const embed = new EmbedBuilder();

    if (queue.node.isPaused()) {
      await interaction.editReply({
        embeds: [embed.setDescription(":warning: The playback is already paused.")],
      });
      return;
    }

    queue.node.pause();

    await interaction.editReply({
      embeds: [embed.setDescription(":ice_cube: Paused the playback! Use the command `/resume` to play again.")],
    });
  }

}