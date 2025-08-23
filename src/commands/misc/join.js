import {Client, MessageFlags, EmbedBuilder} from 'discord.js';
import playerConfigs from '../../configs/player.json' with { type: 'json' };
import { QueryType, useMainPlayer } from 'discord-player';

import { getI18n, formatMessage } from "../../utils/i18n.js";
const getLocalization = async locale => await import(`../../i18n/${getI18n(locale)}/join.json`, { with: { type: 'json' } });

export default  {
  name: 'join',
  description: 'enter in the voice channel.',
  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {

    const words = (await getLocalization(interaction.locale)).default;

    const channel = {
      requester: interaction.member?.voice?.channel,
      bot: interaction.guild.members.me?.voice?.channel
    }

    const embed = new EmbedBuilder();

    if(!channel.requester)
    {
      return interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [embed.setDescription(words.VCRequired)],
      });
    }

    if (channel?.bot?.id === channel?.requester?.id) {
      return interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [embed.setDescription(formatMessage(words.AlreadyInNVC, [channel.bot.toString()]))],
      });
    }

    if(channel.bot)
      {
        return interaction.reply({
          flags: [ MessageFlags.Ephemeral ],
          embeds: [embed.setDescription(words.AlreadyInVC)],
        });
      }

    try {
      const queue = useMainPlayer().queues.create(interaction.guild.id, {
        ...playerConfigs,
      });
  
      await queue.connect(channel.requester);
  
      return interaction.reply({
        embeds: [embed.setDescription(formatMessage(words.JoinedVC, [channel.requester.toString()]))],
      });
    } catch (error) {
      console.error(error);
  
      return interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [embed.setDescription(words.ErrorJoiningVC)],
      });
    }
  }
}