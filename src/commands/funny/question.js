const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports =  {
  name: 'question',
  description: 'make a question of yes / no to the bot',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {

    let question = interaction.options.get('doubt')?.value;

    if(!question?.includes('?'))
    {
      interaction.reply({
        ephemeral: true,
        content: `Ok, it's my turn now, is this even a question?`
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

    interaction.reply(`I'm not answering this yk, I'm not being payed enough to do this!`);
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