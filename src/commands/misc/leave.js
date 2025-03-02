const { Client, Interaction, EmbedBuilder } = require('discord.js');

const { useQueue } = require('discord-player')

module.exports =  {
  name: 'leave',
  description: 'leave the voice channel',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: (client, interaction) => {

    const queue = useQueue(interaction.guild);
    const embed = new EmbedBuilder();

    if (queue && !queue.deleted) queue.delete();

    interaction.reply({
      embeds: [embed.setDescription("Leaving the voice channel!")]
    });
  }

}