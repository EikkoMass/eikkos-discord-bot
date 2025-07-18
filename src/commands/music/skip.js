const { Client, Interaction, EmbedBuilder, MessageFlags } = require('discord.js');

const { useQueue } = require('discord-player');

const { getI18n } = require("../../utils/i18n");
const getLocalization = locale => require(`../../i18n/${getI18n(locale)}/skip`);

module.exports =  {
  name: 'skip',
  description: 'skip the current song on the playlist',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    const words = getLocalization(interaction.locale);

    await interaction.deferReply({ flags: [ MessageFlags.Ephemeral ] });

    const queue = useQueue(interaction.guild);

    if(queue.isEmpty())
    {
      await interaction.editReply({
        embeds: [new EmbedBuilder().setDescription(words.NoSong)],
      });
      return;
    }

    queue.node.skip();

    await interaction.editReply({
      embeds: [new EmbedBuilder().setDescription(`:fast_forward: ${words.Skipped}`)],
    });
  }

}