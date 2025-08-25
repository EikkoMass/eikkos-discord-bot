import { Client, EmbedBuilder, MessageFlags } from 'discord.js';

import { useQueue } from 'discord-player';

import { getLocalization } from "../../utils/i18n.js";

export default  {
  name: 'skip',
  description: 'skip the current song on the playlist',
  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `skip`);

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