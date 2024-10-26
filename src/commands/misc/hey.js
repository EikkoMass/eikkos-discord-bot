module.exports =  {
  name: 'hey',
  description: 'quotes with `hey`',
  callback: async (client, interaction) => {
    return interaction.reply('hey!');
  }
}