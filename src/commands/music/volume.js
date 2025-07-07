const {Client, Interaction, ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require('discord.js');

const { useQueue } = require('discord-player')

module.exports =  {
  name: 'volume',
  description: 'individual command to manage voice channel volume',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const embed = new EmbedBuilder();
    const queue = useQueue(interaction.guild);
    let amount = interaction.options.getNumber('amount', false);

    if(!amount)
    {
      await interaction.editReply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [embed.setDescription(`Current volume level is ${queue.node.volume}%!`)],
      });
      return;
    }

    queue.node.setVolume(amount);
    
    await interaction.editReply({embeds: [embed.setDescription(`Volume has been set to ${amount}%!`)]});
  },

  options: [
    {
      name: 'amount',
      description: 'volume to play the song (0-100)',
      type: ApplicationCommandOptionType.Number,
      min_value: 0,
      max_value: 100,
      required: false
    }
  ]
}