import { Client, MessageFlags, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

import { getI18n } from "../../../../utils/i18n.js";
const getLocalization = async locale => await import(`../../../../i18n/${getI18n(locale)}/skip.json`, { with: { type: 'json' } });

/**
 *  @param {Client} client
 *  @param  interaction
*/
export default async (client, interaction) => {
  try {
    if(!interaction.isButton()) return;
    if(!interaction.customId?.startsWith('player;')) return;
    if(!interaction.customId.includes('skip;')) return;

    const words = (await getLocalization(interaction.locale)).default;

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