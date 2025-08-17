const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType, MessageFlags } = require('discord.js');
const { useQueue } = require('discord-player')

const { getI18n } = require("../../utils/i18n");
const getLocalization = locale => require(`../../i18n/${getI18n(locale)}/autorole`);

module.exports =  {
  name: 'repeat',
  description: 'repeat the current songs on the queue',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {

    const words = getLocalization(interaction.locale);

    const repeatOption = interaction.options.get('type')?.value;

    await interaction.deferReply({ flags: [ MessageFlags.Ephemeral ] });

    const queue = useQueue(interaction.guild);

    if(!queue || queue.isEmpty())
    {
      await interaction.editReply({
        embeds: [new EmbedBuilder().setDescription(words.NoSong)],
      });
      return;
    }

    queue.setRepeatMode(repeatOption);

    await interaction.editReply({
      embeds: [new EmbedBuilder().setDescription(`:repeat: ${words.CommandApplied}`)],
    });
  },
    options: [
      {
        name: 'type',
        description: 'the type of repeat you want',
        type: ApplicationCommandOptionType.Integer,
        required: true,
        autocomplete: true
      }
    ]

}