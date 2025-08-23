import { Client, EmbedBuilder, ApplicationCommandOptionType, MessageFlags } from 'discord.js';
import { useQueue } from 'discord-player';

import { getI18n } from "../../utils/i18n.js";
const getLocalization = async locale => await import(`../../i18n/${getI18n(locale)}/autorole.json`, { with: { type: 'json' } });

export default  {
  name: 'repeat',
  description: 'repeat the current songs on the queue',
  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {

    const words = (await getLocalization(interaction.locale)).default;

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