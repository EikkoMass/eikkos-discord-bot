import { Client, MessageFlags, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

import { getLocalization } from "../../../utils/i18n.js";

export default {
  
  name: 'player',
  tags: ['shuffle'],

  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {
    try {
      const words = await getLocalization(interaction.locale, `shuffle`);

      await interaction.deferReply({ 
        flags: [ MessageFlags.Ephemeral ],
      }) ;
    
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
        return;
      }

      queue.tracks.shuffle();

      await interaction.editReply({
        embeds: [new EmbedBuilder().setDescription(`:arrows_clockwise: ${formatMessage(words.Shuffled, [queue.tracks.size])}`)],
      });
      
    } catch (err) {
        console.log(err);
    }
  }
}