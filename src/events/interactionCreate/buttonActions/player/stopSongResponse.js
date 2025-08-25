import { Client, MessageFlags, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

import { getLocalization } from "../../../../utils/i18n.js";

/**
 *  @param {Client} client
 *  @param  interaction
*/
export default async (client, interaction) => {
  try {
    if(!interaction.isButton()) return;
    if(!interaction.customId?.startsWith('player;')) return;
    if(!interaction.customId.includes('stop;')) return;

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