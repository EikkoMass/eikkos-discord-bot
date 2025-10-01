import { Client, EmbedBuilder, MessageFlags } from 'discord.js';

import { useQueue } from 'discord-player';

import { getLocalization, formatMessage } from "../../utils/i18n.js";

export default  {
  name: 'leave',
  description: 'leave the voice channel',
  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {

    const words = await getLocalization(interaction.locale, `leave`);

    const queue = useQueue(interaction.guild);
    const embed = new EmbedBuilder();

    if(!queue || queue.deleted)
    {
      interaction.reply({
        embeds: [embed.setDescription(words.NotInVC)],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    
    queue.delete();
    interaction.reply({
      embeds: [embed.setDescription(formatMessage(words.LeavingVC, [interaction.guild.members.me?.voice?.channel]))],
      flags: MessageFlags.Ephemeral,
    });
  }

}