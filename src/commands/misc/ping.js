module.exports =  {
  name: 'ping',
  description: 'pong',
  // devOnly: Boolean,
  // testOnly: Boolean,
  // deleted: Boolean,
  // options: Object[],

  callback: (client, interaction) => {
    interaction.reply(`Pong! ${client.ws.ping}ms`);
  }
}