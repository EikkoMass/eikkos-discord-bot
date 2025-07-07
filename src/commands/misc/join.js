const {Client, Interaction, MessageFlags, EmbedBuilder} = require('discord.js');
const playerConfigs = require('../../configs/player.json');
const { QueryType, useMainPlayer } = require('discord-player')

module.exports =  {
  name: 'join',
  description: 'enter in the voice channel.',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {

    const channel = {
      requester: interaction.member?.voice?.channel,
      bot: interaction.guild.members.me?.voice?.channel
    }

    const embed = new EmbedBuilder();

    if(!channel.requester)
    {
      return interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [embed.setDescription("You need to be in a voice channel!")],
      });
    }

    if (channel?.bot?.id === channel?.requester?.id) {
      return interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [embed.setDescription(`I'm already in the ${channel.bot.toString()} channel.`)],
      });
    }

    if(channel.bot)
      {
        return interaction.reply({
          flags: [ MessageFlags.Ephemeral ],
          embeds: [embed.setDescription("I'm already in a voice channel!")],
        });
      }

    try {
      const queue = useMainPlayer().queues.create(interaction.guild.id, {
        ...playerConfigs,
      });
  
      await queue.connect(channel.requester);
  
      return interaction.reply({
        embeds: [embed.setDescription(`Joined the ${channel.requester.toString()} channel.`)],
      });
    } catch (error) {
      console.error(error);
  
      return interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [embed.setDescription("There was an error joining the voice channel!")],
      });
    }
  }
}