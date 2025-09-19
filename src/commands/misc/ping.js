export default  {
  name: 'ping',
  description: 'Replies with the bot ping!!',
  // devOnly: Boolean,
  // testOnly: Boolean,
  // deleted: Boolean,
  // options: Object[],

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping  = reply.createdTimestamp - interaction.createdTimestamp;

    interaction.editReply(
      `🏓 Pong! Client ${ping}ms | Websocket ${client.ws.ping}ms`
    );
  }
}