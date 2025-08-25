import { Client, EmbedBuilder, MessageFlags } from 'discord.js';

import { useQueue } from 'discord-player';

import { getLocalization } from "../../utils/i18n.js";

export default  {
  name: 'stop',
  description: 'stop the song on the voice channel',
  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `stop`);

    await interaction.deferReply({ flags: [ MessageFlags.Ephemeral ] });

    const queue = useQueue(interaction.guild);
    const embed = new EmbedBuilder();

    if (queue.isPlaying()) 
    {
      queue.node.stop();
      await interaction.editReply({ embeds: [embed.setDescription(`:rock: ${words.Stopped}`)] });
      return; 
    }

      await interaction.editReply({ embeds: [embed.setDescription(`:warning: ${words.NoSongPlaying}`)] });
  }

}