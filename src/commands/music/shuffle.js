import { Client, EmbedBuilder, MessageFlags } from 'discord.js';
import { useQueue } from 'discord-player';

import { getI18n, formatMessage } from "../../utils/i18n.js";
const getLocalization = async locale => await import(`../../i18n/${getI18n(locale)}/shuffle.json`, { with: { type: 'json' } });

export default  {
  name: 'shuffle',
  description: 'shuffles the current playlist',
  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {

    const words = (await getLocalization(interaction.locale)).default;
    await interaction.deferReply({ flags: [ MessageFlags.Ephemeral ] });

    const queue = useQueue(interaction.guild);

    if(!queue || queue.isEmpty())
    {
      await interaction.editReply({
        embeds: [new EmbedBuilder().setDescription(words.NoSong)],
      });
      return;
    } else if (queue.tracks.size < 2)
    {
      await interaction.editReply({
        embeds: [new EmbedBuilder().setDescription(words.NotEnoughTracks)],
      });
    }

    queue.tracks.shuffle();

    await interaction.editReply({
      embeds: [new EmbedBuilder().setDescription(`:arrows_clockwise: ${formatMessage(words.Shuffled, [queue.tracks.size])}`)],
    });
  }

}