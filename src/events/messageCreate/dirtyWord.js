const {Client, Message} = require('discord.js');
const DirtyWord = require('../../models/dirtyword')

/**
 *  @param {Client} client
 *  @param {Message} message
*/
module.exports = async (client, message) => {
  if(!message.inGuild() || message.author.bot) return;

  try{

    let dirtyWordObj = client.dirtyWordCache.result.find(dirty => dirty.guildId === message.guild.id);
    let alreadySearchedOnDB = client.dirtyWordCache.search.some(dirty => dirty === message.guild.id);

    if(!dirtyWordObj && !alreadySearchedOnDB) {
      
      dirtyWordObj = await DirtyWord.findOne({ guildId: message.guild.id });
      client.dirtyWordCache.search.push(`${message.guild.id}`);

      if(!dirtyWordObj) return;

      client.dirtyWordCache.result.push(dirtyWordObj);
    } 
    else if (!dirtyWordObj) return;

    const currentMessage = message.content?.toLowerCase();
    
    if((dirtyWordObj.type === 1 && currentMessage.includes(dirtyWordObj.word)) || currentMessage === dirtyWordObj.word?.toLowerCase())
    {
      const targetUser = await message.guild.members.fetch(message.author.id);
      targetUser.kick('Bad word identified >:( ').catch(()=> {});
    }
  } catch(e) {
    console.log(e);
  }
}