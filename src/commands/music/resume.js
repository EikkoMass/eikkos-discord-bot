import { Client, EmbedBuilder, MessageFlags } from 'discord.js';

import { useQueue } from 'discord-player';

import { getI18n } from "../../utils/i18n.js";
const getLocalization = async locale => await import(`../../i18n/${getI18n(locale)}/resume.json`, { with: { type: 'json' } });

export default  {
  name: 'resume',
  description: 'resume the paused playback',
  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {
    await interaction.deferReply({ flags: [ MessageFlags.Ephemeral ] });

    const words = (await getLocalization(interaction.locale)).default;

    const queue = useQueue(interaction.guild);
    const embed = new EmbedBuilder();

    if (queue.node.isPlaying()) {
      await interaction.editReply({
        embeds: [embed.setDescription(`:warning: ${words.NotPaused}`)],
      });
      return;
    }

    queue.node.resume();

    await interaction.editReply({
      embeds: [embed.setDescription(`:fire: ${words.Resumed}`)],
    });
  }

}