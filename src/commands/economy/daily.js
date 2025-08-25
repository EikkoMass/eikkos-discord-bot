import User from '../../models/user.js';
import { Client, MessageFlags } from 'discord.js';

import { getLocalization, formatMessage } from "../../utils/i18n.js";

const dailyAmount = 1000;

export default {

  /**
   * 
   * @param {Client} client 
   * @param  interaction 
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, 'daily');

    if(!interaction.inGuild())
    {
      interaction.reply({
        content: words.OnlyInsideServer,
        flags: [ MessageFlags.Ephemeral ],
      });
      return;
    }

    try {
      await interaction.deferReply({ 
        flags: [ MessageFlags.Ephemeral ],
      });

      let query = {
        userId: interaction.member.id,
        guildId:  interaction.guild.id
      }

      let user = await User.findOne(query);

      if(user){
        const lastDailyDate = user.lastDaily.toDateString();
        const currentDate = new Date().toDateString();

        if(lastDailyDate === currentDate)
        {
          interaction.editReply(words.AlreadyCollected);
          return;
        }

        user.lastDaily = new Date();
      } else {
        user = new User({...query, lastDaily: new Date()});
      }

      user.balance += dailyAmount;
      await user.save();

      interaction.editReply(formatMessage(words.AddedToBalance, [dailyAmount, user.balance]));

    } catch(e)
    {
      console.log(`Error with /daily: ${e}`);
    }
  },

  name: 'daily',
  description: 'Collect your dailies!'
}