export default {
  name: 'doubleDollarSign',
  description: 'quote the user who writes a text that includes "$$"',
  match: "$$",
  type: "includes",
  callback: async (client, message) => {
    message.channel.send('brabo');
  }
}