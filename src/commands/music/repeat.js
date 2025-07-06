const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType, MessageFlags } = require('discord.js');
const { useQueue, QueueRepeatMode } = require('discord-player')

module.exports =  {
  name: 'repeat',
  description: 'repeat the current songs on the queue',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {

    const repeatOption = interaction.options.get('type')?.value;

    await interaction.deferReply({ flags: [ MessageFlags.Ephemeral ] });

    const queue = useQueue(interaction.guild);

    if(!queue || queue.isEmpty())
    {
      await interaction.editReply({
        embeds: [new EmbedBuilder().setDescription("There is no song to repeat.")],
      });
      return;
    }

    queue.setRepeatMode(repeatOption);

    await interaction.editReply({
      embeds: [new EmbedBuilder().setDescription(`:repeat: Repeat command applied`)],
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