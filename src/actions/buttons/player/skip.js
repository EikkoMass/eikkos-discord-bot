import { Client, MessageFlags, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

import { getLocalization } from "../../../utils/i18n.js";

export default {
  
  name: 'player',
  tags: ['skip'],

  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {
    try {

      const words = await getLocalization(interaction.locale, `skip`);

      await interaction.deferReply({ 
        flags: [ MessageFlags.Ephemeral ], 
      });
    
      const queue = useQueue(interaction.guild);
    
      if(!queue || queue.isEmpty())
      {
        await interaction.editReply({
          embeds: [new EmbedBuilder().setDescription(words.NoSong)],
        });
        return;
      }


      queue.node.skip();
      await interaction.editReply({
        embeds: [ new EmbedBuilder().setDescription(`:fast_forward: ${words.Skipped}`) ]
      });
    
    } catch (err) {
        console.log(err);
    }
  }
}