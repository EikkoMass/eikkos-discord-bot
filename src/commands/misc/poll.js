const {PollLayoutType, Client, Interaction, ApplicationCommandOptionType } = require('discord.js');

module.exports =  {
  /** 
   * 
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {

    switch(interaction.options.getSubcommand())
    {
      case 'create':
        await createPoll(client, interaction);
        break;
      case 'finish':
        await finishPoll(client, interaction);
        break;
      default:
        await interaction.reply({
          ephemeral: true,
          content: `Poll command not found!`
        });
        return;
    }
  },
  options: [
    {
      name: 'create',
      description: 'Creates a new poll',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'question',
          description: `What question you want?`,
          type: ApplicationCommandOptionType.String,
          required: true
        },        {
          name: 'choice1',
          description: `choice1`,
          type: ApplicationCommandOptionType.String,
          required: true
        },        {
          name: 'choice2',
          description: `choice2`,
          type: ApplicationCommandOptionType.String,
          required: true
        },        {
          name: 'choice3',
          description: `choice3`,
          type: ApplicationCommandOptionType.String
        },
        {
          name: 'duration',
          description: `How much time you want to the poll exists?`,
          type: ApplicationCommandOptionType.Integer
        }
      ]
    },
    {
      name: 'finish',
      description: 'Finish existing pinned polls',
      type: ApplicationCommandOptionType.Subcommand
    }
  ],
  name: 'poll',
  description: 'Manage polls'
};

async function createPoll(client, interaction)
{
  
  const choice1 = interaction.options.get('choice1')?.value;
  const choice2 = interaction.options.get('choice2')?.value;
  const choice3 = interaction.options.get('choice3')?.value;

  const duration = interaction.options.get('duration')?.value || 2;
  
  const question = { text: interaction.options.get('question')?.value }

  const answers = [
    { text: choice1, emoji: '🤏' },
    { text: choice2, emoji: '🤖' },
  ];

  if(choice3)
  {
    answers.push({ text: choice3, emoji: '🧩' });
  }

  const message = await interaction.channel.send({
    poll: {
      question,
      answers,
      allowMultiselect: false,
      duration,
      layoutType: PollLayoutType.Default
    }
  });

  await message.pin();
  await interaction.reply({content: `Created a new poll!`, ephemeral: true});
}

async function finishPoll(client, interaction)
{
  const msgs = await interaction.channel.messages.fetchPinned()
    
  msgs.forEach(async msg => {
    if(msg.poll)
    {
      await msg.unpin();
      await msg.poll.end();
    }
  });

  await interaction.reply({content: `Finished pending polls!`, ephemeral: true});
}