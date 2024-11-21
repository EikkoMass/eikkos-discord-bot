const {ApplicationCommandOptionType, Client, Interaction } = require('discord.js');
const DirtyWord = require('../../models/dirtyword')

module.exports =  {
  /** 
   * 
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    switch(interaction.options.getSubcommand())
    {
      case 'current':
        await getCurrentDirtyWord(client, interaction);
        break;
      case 'register':
        await setDirtyWord(client, interaction);
        break;
      default:
        await interaction.reply({
          ephemeral: true,
          content: `Dirty Word command not found!`
        });
        return;
    }
    
  },
  options: [
  {
    name: 'current',
    description: 'current word registered on this guild',
    type: ApplicationCommandOptionType.Subcommand
  },
  {
    name: 'register',
    description: 'register an bad word on this guild',
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: 'word',
        description: 'bad word',
        type: ApplicationCommandOptionType.String,
        required: true
      }
    ]
  }
],
  name: 'dirty-word',
  description: 'Sets an word to auto-ban the user who write'
};

async function getCurrentDirtyWord(client, interaction)
{
  if(!client.dirtyWordCache)
  {
    client.dirtyWordCache = [];
  }

  const dirtyCache = client.dirtyWordCache.find(dirty => dirty.guildId === interaction.guild.id);
  
  const dirtyWordObj = dirtyCache || await DirtyWord.findOne({ guildId: interaction.guild.id });

  if(dirtyWordObj)
  {
    const word = dirtyWordObj.word;
    const censoredWord = word.length > 1 ? (word.slice(0, word.length / 2) + '****') : word;
    await interaction.reply({
      ephemeral: true,
      content: `The current bad word is ${censoredWord}`
    });
  } else {
    await interaction.reply({
      ephemeral: true,
      content: `No bad word registered on this guild`
    });
  }

}

async function setDirtyWord(client, interaction)
{
  if(!client.dirtyWordCache)
  {
    client.dirtyWordCache = [];
  }

  const word = interaction.options.get('word')?.value;
  let dirtyWordObj = await DirtyWord.findOne({ guildId: interaction.guild.id });
  const newDirtyWord = { guildId: interaction.guild.id, word };

  if(dirtyWordObj)
  {
    dirtyWordObj.word = word;
    let index = client.dirtyWordCache.findIndex(dirty => dirty.guildId === interaction.guild.id);

    if(index > -1)
    {
      client.dirtyWordCache[index].word = word;
    }

  } else {
    dirtyWordObj = new DirtyWord(newDirtyWord);
    client.dirtyWordCache.push(newDirtyWord);
  }

  dirtyWordObj.save();
  await interaction.reply({
    ephemeral: true,
    content: `Created the new word!`
  });
}
