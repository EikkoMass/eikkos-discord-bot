import { Client, MessageFlags, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

import { getI18n } from "../../../../utils/i18n.js";
const getLocalization = async locale => await import(`../../../../i18n/${getI18n(locale)}/pause.json`, { with: { type: 'json' } });

/**
 *  @param {Client} client
 *  @param  interaction
*/
export default async (client, interaction) => {
  try {
      if(!interaction.isButton()) return;
      if(!interaction.customId?.startsWith('player;')) return;
      if(!interaction.customId.includes('pause;')) return;

      const words = (await getLocalization(interaction.locale)).default;

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