const { Client, Message, AttachmentBuilder, MessageFlags } = require('discord.js');

module.exports = {
  name: 'nerdDetector',
  description: 'quote the user with the nerdiest comment possible',
  match: "",
  type: "includes",

  /**
  *  @param {Client} client
  *  @param {Message} message
  */
  callback: async (client, message) => {
    if(message.author.bot) return;

    // 3%
    if(message.content?.length > 3 && Math.floor((Math.random() * 100) + 1) > 97) {
      // 15%
      const isFire = Math.floor((Math.random() * 100) + 1) > 85;

      const file = new AttachmentBuilder(`src/gifs/${isFire ? 'fire' : 'nerd'}.gif`);
      message.reply({
        content: isFire ? `"${message.content.toUpperCase()}" 🗣️🗣️🗣️🔥🔥🔥` : `'${message.content.toLowerCase()}' ☝☝🤓`,
        files: [file]
      });
    
      // 1%
      if(!isFire && Math.floor((Math.random() * 100) + 1) > 99)
      {
        message.reply({
          flags: [ MessageFlags.Ephemeral ],
          content: `((Sorry if you feel offended, nothing personal dude!))`,
        });
      }
    
    }
  }
}