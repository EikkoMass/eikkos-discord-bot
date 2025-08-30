import { Client, MessageFlags, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

import { getLocalization } from "../../../utils/i18n.js";

export default {
  
  name: 'player',
  tags: ['pause'],

  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {
    try {
      const words = await getLocalization(interaction.locale, `pause`);

      await interaction.deferReply({ 
        flags: [ MessageFlags.Ephemeral ], 
      }) ;
    
      const queue = useQueue(interaction.guild);

      if(!queue?.node)
      {
        await interaction.editReply({
          embeds: [new EmbedBuilder().setDescription(":x: " + words.NoQueue)],
        });
        return;
      }

      if(!queue.node.isPlaying()){
        await interaction.editReply({
          embeds: [new EmbedBuilder().setDescription(words.AlreadyPaused)]
        });
        return;
      }
  
      queue.node.pause();
      await interaction.editReply({
        embeds: [new EmbedBuilder().setDescription(words.Paused)]
      });
  
    } catch (err) {
        console.log(err);
    }
  }
}