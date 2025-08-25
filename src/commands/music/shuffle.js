import { Client, EmbedBuilder, MessageFlags } from 'discord.js';
import { useQueue } from 'discord-player';

import { getLocalization, formatMessage } from "../../utils/i18n.js";

export default  {
  name: 'shuffle',
  description: 'shuffles the current playlist',
  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {

    const words = await getLocalization(interaction.locale, `shuffle`);
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