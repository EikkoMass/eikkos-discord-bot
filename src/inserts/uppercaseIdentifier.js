export default {
  name: 'uppercaseIdentifier',
  description: 'asks to keep the voice down',
  match: message => (/[a-zA-Z]+/g).test(message) && message.toUpperCase() == message,
  type: "custom",
  callback: async (client, message) => {
    if(!message.inGuild() || message.author.bot) return;

    await message.reply("Keep your voice down! >_>");
  }
}