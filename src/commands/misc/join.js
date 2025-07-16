const {Client, Interaction, MessageFlags, EmbedBuilder} = require('discord.js');
const playerConfigs = require('../../configs/player.json');
const { QueryType, useMainPlayer } = require('discord-player');

const { getI18n, formatMessage } = require("../../utils/i18n");
const getLocalization = locale => require(`../../i18n/${getI18n(locale)}/join`);

module.exports =  {
  name: 'join',
  description: 'enter in the voice channel.',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {

    const words = getLocalization(interaction.locale);

    const channel = {
      requester: interaction.member?.voice?.channel,
      bot: interaction.guild.members.me?.voice?.channel
    }

    const embed = new EmbedBuilder();

    if(!channel.requester)
    {
      return interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [embed.setDescription(words.VCRequired)],
      });
    }

    if (channel?.bot?.id === channel?.requester?.id) {
      return interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [embed.setDescription(formatMessage(words.AlreadyInNVC, [channel.bot.toString()]))],
      });
    }

    if(channel.bot)
      {
        return interaction.reply({
          flags: [ MessageFlags.Ephemeral ],
          embeds: [embed.setDescription(words.AlreadyInVC)],
        });
      }

    try {
      const queue = useMainPlayer().queues.create(interaction.guild.id, {
        ...playerConfigs,
      });
  
      await queue.connect(channel.requester);
  
      return interaction.reply({
        embeds: [embed.setDescription(formatMessage(words.JoinedVC, [channel.requester.toString()]))],
      });
    } catch (error) {
      console.error(error);
  
      return interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [embed.setDescription(words.ErrorJoiningVC)],
      });
    }
  }
}