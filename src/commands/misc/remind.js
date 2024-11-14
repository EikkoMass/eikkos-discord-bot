const {Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const ms = require('ms');


module.exports =  {
  name: 'remind',
  description: 'Reminds you something later.',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    
    let time = interaction.options.get('time')?.value;
    const message = interaction.options.get('message')?.value || "";
    const user = interaction.options.get('user')?.value;
    let receiver = interaction.member;

    time = time
      .replace('segundo', 'second')
      .replace('minuto', 'minute')
      .replace('hora', 'hour');

    if(user)
    {
      receiver = await interaction.guild.members.fetch(user);
    }

    const duration = ms(time);
    const {default: prettyMs} = await import('pretty-ms');

    const formattedDuration = prettyMs(duration, {verbose: true});

    interaction.reply({
      ephemeral: true,
      content: `Sure, i'll ping about this in ${formattedDuration}`
    });

    const embed = new EmbedBuilder();

      embed
      .setDescription(`<@${receiver.id}>${' ' + message || ''}`)
      .setFooter({ text: `${formattedDuration} ago` })
      
    
    setTimeout(() => {
      interaction.channel.send({
        embeds: [embed]
      });
    }, Number.parseInt(duration));
  },

  options: [
    {
      name: 'time',
      description: 'the time out to remind (30 minutes , 1 hour , 1 day)',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'message',
      description: 'What you want to remind?',
      type: ApplicationCommandOptionType.String,
    },
    {
      name: 'user',
      description: 'Who will receive the message?',
      type: ApplicationCommandOptionType.User,
    }
  ]
}