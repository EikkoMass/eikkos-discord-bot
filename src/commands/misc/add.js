const {ApplicationCommandOptionType } = require('discord.js');

module.exports =  {
  callback: async (client, interaction) => {
  try{
    await interaction.deferReply();

    const num1 = await interaction.options.get('first-number')?.value;
    const num2 = await interaction.options.get('second-number')?.value;
    await interaction.editReply(`sum: ${num1 + num2}`);
  }
  catch(e)
  {
    console.log(e);
  }
  },
  name: 'add',
  description: 'sum the values',
  options: [
    {
      name: 'first-number',
      description: 'The first input  value',
      required: true,
      type: ApplicationCommandOptionType.Integer
    },      
    {
      name: 'second-number',
      description: 'The second value',
      required: true,
      type: ApplicationCommandOptionType.Integer
    },  
  ]
}