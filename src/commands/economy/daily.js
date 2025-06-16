const User = require('../../models/user');
const {Client, Interaction} = require('discord.js');

const { getI18n, formatMessage } = require("../../utils/i18n");
const getLocalization = locale => require(`../../i18n/${getI18n(locale)}/daily`);

const dailyAmount = 1000;

module.exports = {

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction) => {
    const words = getLocalization(interaction.locale);

    if(!interaction.inGuild())
    {
      interaction.reply({
        content: words.OnlyInsideServer,
        ephemeral: true
      });
      return;
    }

    try {
      await interaction.deferReply({ ephemeral: true });
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