import { Client, MessageFlags, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

import { getLocalization } from "../../../utils/i18n.js";

export default {
  
  name: 'player',
  tags: ['stop'],

  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {
    try {

      const words = await getLocalization(interaction.locale, `stop`);
      const embed = new EmbedBuilder();

      await interaction.deferReply({ 
        flags: [ MessageFlags.Ephemeral ],
      }) ;
    
      const queue = useQueue(interaction.guild);

      if (queue?.isPlaying()) 
      {
        queue.node.stop();
        await interaction.editReply({ embeds: [embed.setDescription(`:rock: ${words.Stopped}`)] }); 
        return;
      }

      await interaction.editReply({ embeds: [embed.setDescription(`:warning: ${words.NoSongPlaying}`)] });

    } catch (err) {
        console.log(err);
    }
  }
}