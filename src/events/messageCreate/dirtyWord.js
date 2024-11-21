const {Client, Message} = require('discord.js');
const DirtyWord = require('../../models/dirtyword')

/**
 *  @param {Client} client
 *  @param {Message} message
*/
module.exports = async (client, message) => {
  if(!message.inGuild() || message.author.bot) return;

  if(!client.dirtyWordCache)
  {
      client.dirtyWordCache = [];
  }

  let dirtyWordObj = client.dirtyWordCache.find(dirty => dirty.guildId === message.guild.id);

  if(!dirtyWordObj) {
    dirtyWordObj = await DirtyWord.findOne({ guildId: message.guild.id });

    if(!dirtyWordObj) return;

    client.dirtyWordCache.push(dirtyWordObj);
  }

  if(message.content === dirtyWordObj.word)
  {
    const targetUser = await message.guild.members.fetch(message.author.id);
    targetUser.kick('Bad word identified >:( ');
  }
}