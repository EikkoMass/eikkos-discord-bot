import { Client, EmbedBuilder, MessageFlags } from 'discord.js';

import { useQueue } from 'discord-player';

import { getI18n } from "../../utils/i18n.js";
const getLocalization = async locale => await import(`../../i18n/${getI18n(locale)}/stop.json`, { with: { type: 'json' } });

export default  {
  name: 'stop',
  description: 'stop the song on the voice channel',
  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {
    const words = (await getLocalization(interaction.locale)).default;

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