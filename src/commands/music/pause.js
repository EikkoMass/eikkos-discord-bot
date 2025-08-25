import { Client, EmbedBuilder, MessageFlags } from 'discord.js';

import { useQueue } from 'discord-player';
import { getLocalization } from "../../utils/i18n.js";

export default  {
  name: 'pause',
  description: 'pause the song on the voice channel',
  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {
    
    const words = await getLocalization(interaction.locale, `pause`);

    await interaction.deferReply({ flags: [ MessageFlags.Ephemeral ]  });

    const queue = useQueue(interaction.guild);
    const embed = new EmbedBuilder();

    if(!queue?.node)
    {
      await interaction.editReply({
        embeds: [embed.setDescription(":x: " + words.NoQueue)],
      });
      return;
    }

    if (queue.node.isPaused()) {
      await interaction.editReply({
        embeds: [embed.setDescription(":warning: " + words.AlreadyPaused)],
      });
      return;
    }

    queue.node.pause();

    await interaction.editReply({
      embeds: [embed.setDescription(":ice_cube: " + words.Paused)],
    });
  }

}