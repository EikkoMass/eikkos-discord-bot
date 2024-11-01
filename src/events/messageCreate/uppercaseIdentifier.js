const {Client, Message} = require('discord.js');

/**
 *  @param {Client} client
 *  @param {Message} message
*/
module.exports = async (client, message) => {
  if(!message.inGuild() || message.author.bot) return;
  const containsCharsRegex = /[a-zA-Z]+/g;

  try{
    if(containsCharsRegex.test(message.content) && message.content?.toUpperCase() == message.content)
      await message.reply("Keep your voice down! >_>");

  } catch(e) {
    console.log(`Error on uppercase checking: ${e}`);
  }
}