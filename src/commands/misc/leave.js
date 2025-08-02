const { Client, Interaction, EmbedBuilder, MessageFlags } = require('discord.js');

const { useQueue } = require('discord-player');

const { getI18n, formatMessage } = require("../../utils/i18n");
const getLocalization = locale => require(`../../i18n/${getI18n(locale)}/leave`);

module.exports =  {
  name: 'leave',
  description: 'leave the voice channel',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: (client, interaction) => {

    const words = getLocalization(interaction.locale);

    const queue = useQueue(interaction.guild);
    const embed = new EmbedBuilder();

    if(!queue || queue.deleted)
    {
      interaction.reply({
        embeds: [embed.setDescription(words.NotInVC)],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    
    queue.delete();
    interaction.reply({
      embeds: [embed.setDescription(formatMessage(words.LeavingVC, [interaction.guild.members.me?.voice?.channel]))],
      flags: MessageFlags.Ephemeral,
    });
  }

}