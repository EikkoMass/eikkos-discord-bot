import {Client, Message} from 'discord.js';

/**
 *  @param {Client} client
 *  @param {Message} message
*/
export default async (client, message) => {
  if(!message.inGuild() || message.author.bot) return;
  const containsCharsRegex = /[a-zA-Z]+/g;

  try{
    if(containsCharsRegex.test(message.content) && message.content?.toUpperCase() == message.content)
      await message.reply("Keep your voice down! >_>");

  } catch(e) {
    console.log(`Error on uppercase checking: ${e}`);
  }
}