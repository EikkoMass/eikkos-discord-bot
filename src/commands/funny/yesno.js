import { Client, ApplicationCommandOptionType, EmbedBuilder, MessageFlags } from 'discord.js';

import { getLocalization } from "../../utils/i18n.js";

export default  {
  name: 'yesno',
  description: 'make a question of yes / no to the bot',
  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {

    const words = await getLocalization(interaction.locale, `yesno`);

    let question = interaction.options.get('doubt')?.value;

    if(!question?.includes('?'))
    {
      interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        content: words.NoQuestionMark
      });
      return;
    }

    const res = await fetch('https://yesno.wtf/api');
    
    if(res.ok)
    {
      const json = await res.json();

      const embed = new EmbedBuilder()
        .setImage(json.image)
        .setDescription(question)
        .setFooter({ text: new Date().toDateString(), iconURL: interaction.member.displayAvatarURL({size: 256}) });

      interaction.reply({
        embeds: [embed]
      });
      return;
    }

    interaction.reply({
      flags: [ MessageFlags.Ephemeral ],
      embeds: [new EmbedBuilder().setDescription(words.NotAnswering)]
    });
  },
  options: [
    {
      name: 'doubt',
      description: 'the question you want to do',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ]
}