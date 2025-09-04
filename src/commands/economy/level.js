import {Client, ApplicationCommandOptionType, AttachmentBuilder } from 'discord.js';
import Level from '../../models/level.js';
import { Font, RankCardBuilder } from 'canvacord';
import calculateLevelXp from '../../utils/calculateLevelXp.js';

import { getLocalization, formatMessage } from '../../utils/i18n.js'

export default {
  /** 
   * 
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {

    const words = getLocalization(interaction.locale, `level`);

    if(!interaction.inGuild()) {
      interaction.reply(words.ServerOnly);
      return;
    }

    await interaction.deferReply();

    const mentionedUserId = interaction.options.get('target-user')?.value;
    const targetUserId = mentionedUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    const fetchLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id
    });

    if(!fetchLevel)
    {
      interaction.editReply(
        mentionedUserId ? formatMessage(words.UserNoLevels, [targetUserObj.user.tag]) :
        words.NoLevels
      );
      return;
    }

    let allLevels = await Level.find({ guildId: interaction.guild.id }).select('-_id userId level xp');

    allLevels.sort((a,b) => {
      if(a.level === b.level)
      {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    Font.loadDefault();

    let currentRank = allLevels.findIndex(lvl => lvl.userId === targetUserId) + 1;
    const rank = new RankCardBuilder()
      .setAvatar(targetUserObj.user.displayAvatarURL({size: 256}))
      .setRank(currentRank)
      .setLevel(fetchLevel.level)
      .setCurrentXP(fetchLevel.xp)
      .setRequiredXP(calculateLevelXp(fetchLevel.level))
      .setStatus(targetUserObj.presence.status)
      .setUsername(targetUserObj.user.username);
  
      const data = await rank.build();
      const attachment = new AttachmentBuilder(data);

      interaction.editReply({ files: [attachment] });
    },

  name: 'level',
  description: 'Shows your/someone\'s level',
  options: [
    {
      name: 'target-user',
      description: 'The user whose level you want to see.',
      type: ApplicationCommandOptionType.Mentionable
    }
  ]
}