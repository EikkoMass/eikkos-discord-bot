module.exports = {
  name: 'doubleDollarSign',
  description: 'quote the user who writes a text that includes "$$"',
  match: "$$",
  type: "equals",
  callback: async (client, message) => {
    message.channel.send('brabo');
  }
}