const { Client, Interaction, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player')

module.exports =  {
  name: 'shuffle',
  description: 'shuffles the current playlist',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    await interaction.deferReply({ flags: [ MessageFlags.Ephemeral ] });

    const queue = useQueue(interaction.guild);

    if(!queue || queue.isEmpty())
    {
      await interaction.editReply({
        embeds: [new EmbedBuilder().setDescription("There is no song to shuffle.")],
      });
      return;
    } else if (queue.tracks.size < 2)
    {
      await interaction.editReply({
        embeds: [new EmbedBuilder().setDescription("There is not enough tracks to shuffle.")],
      });
    }

    queue.tracks.shuffle();

    await interaction.editReply({
      embeds: [new EmbedBuilder().setDescription(`:arrows_clockwise: Shuffled ${queue.tracks.size} tracks`)],
    });
  }

}