const { Client, Interaction, EmbedBuilder } = require('discord.js');

const { useQueue } = require('discord-player')

module.exports =  {
  name: 'skip',
  description: 'skip the current song on the playlist',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const queue = useQueue(interaction.guild);

    if(queue.isEmpty())
    {
      await interaction.editReply({
        ephemeral: true,
        embeds: [new EmbedBuilder().setDescription("There is no song to skip.")],
      });
      return;
    }

    queue.node.skip();

    await interaction.editReply("Skipped");
  }

}