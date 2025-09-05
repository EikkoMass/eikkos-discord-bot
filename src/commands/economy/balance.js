import { ApplicationCommandOptionType, Client, MessageFlags, EmbedBuilder } from 'discord.js';
import User from '../../models/user.js';

import { getLocalization, formatMessage } from '../../utils/i18n.js';

export default {
  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {

    const words = await getLocalization(interaction.locale, `balance`);

    if(!interaction.inGuild())
    {
      interaction.reply({
        embeds: [new EmbedBuilder().setDescription(words.ServerOnly)],
        flags: [ MessageFlags.Ephemeral ],
      });
      return;
    }

    const targetUserId = interaction.options.get('user')?.value || interaction.member.id;

    const user = await User.findOne({userId: targetUserId, guildId: interaction.guild.id});

    if(!user)
    {
      interaction.reply({
        embeds: [new EmbedBuilder().setDescription(formatMessage(words.UserNoProfile, [targetUserId]))]
      });
      return;
    }

    interaction.reply({
      embeds: [ new EmbedBuilder().setDescription(
        targetUserId === interaction.member.id ? 
          formatMessage(words.Balance, [user.balance]) 
            :
          formatMessage(words.UserBalance, [targetUserId, user.balance])
        )]
    });
  },

  name: 'balance',
  description: "See yours/someone else's balance",

  options: [
    {
      name: "user",
      description: "The user whose balance you want to get",
      type:ApplicationCommandOptionType.User,
    }
  ]
}