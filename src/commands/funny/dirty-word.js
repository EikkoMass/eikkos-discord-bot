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
      case 'remove':
        await removeDirtyWord(client, interaction);
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
      },
      {
        name: 'type',
        description: 'How you can identify the word?',
        type: ApplicationCommandOptionType.Integer,
        autocomplete: true
      },
    ]
  },
  {
    name: 'remove',
    description: 'remove the word',
    type: ApplicationCommandOptionType.Subcommand
  },
],
  name: 'dirty-word',
  description: 'Sets an word to auto-ban the user who write.'
};

async function removeDirtyWord(client, interaction)
{

  const indexResult = client.dirtyWordCache.result.findIndex(dirty => dirty.guildId === interaction.guild.id);
  const indexSearch = client.dirtyWordCache.search.findIndex(dirty => dirty === interaction.guild.id);

  if(indexResult > -1)
  {
    client.dirtyWordCache.result.splice(indexResult, 1);
  }

  if(indexSearch > -1)
  {
    client.dirtyWordCache.search.splice(indexSearch, 1);
  }

  let dirtyWord = await DirtyWord.findOneAndDelete({ guildId: interaction.guild.id });

  if(dirtyWord)
  {
    await interaction.reply({
      ephemeral: true,
      content: `Bad word removed successfully!`
    });
  } else {
    await interaction.reply({
      ephemeral: true,
      content: `No bad word registered on this guild`
    });
  }
}

async function getCurrentDirtyWord(client, interaction)
{

  const dirtyCache = client.dirtyWordCache.result.find(dirty => dirty.guildId === interaction.guild.id);
  
  const dirtyWordObj = dirtyCache || await DirtyWord.findOne({ guildId: interaction.guild.id });

  if(dirtyWordObj)
  {
    const word = dirtyWordObj.word;
    const censoredWord = word.length > 1 ? (word.slice(0, word.length / 2) + '*'.repeat(word.length / 2)) : word;
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
  const word = interaction.options.get('word')?.value;
  const type = interaction.options.get('type')?.value || 0;

  let dirtyWordObj = await DirtyWord.findOne({ guildId: interaction.guild.id });

  if(dirtyWordObj)
  {
    dirtyWordObj.word = word;
    let index = client.dirtyWordCache.result.findIndex(dirty => dirty.guildId === interaction.guild.id);

    if(index > -1)
    {
      client.dirtyWordCache.result[index].word = word;
      client.dirtyWordCache.result[index].type = type;
    }

  } else {
    const newDirtyWord = { guildId: interaction.guild.id, word, type };

    dirtyWordObj = new DirtyWord(newDirtyWord);
    client.dirtyWordCache.result.push(newDirtyWord);
  }

  dirtyWordObj.save();
  await interaction.reply({
    ephemeral: true,
    content: `Created the new word!`
  });
}
