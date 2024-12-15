const {ApplicationCommandOptionType, Client, Interaction } = require('discord.js');
const Note = require('../../models/note');

module.exports =  { //TODO testar
  callback: async (client, interaction) => {

    switch(interaction.options.getSubcommand())
    {
      case 'add':
        await add(client, interaction);
        return;
      default:
        await interaction.reply({
          ephemeral: true,
          content: `Note command not found!`
        });
        return;
    }

  },
  name: 'note',
  description: 'Manage your notes by guild.',
  options: [
    {
      name: 'add',
      description: 'Current repository of the bot',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'text',
          description: 'Your note',
          type: ApplicationCommandOptionType.String,
        }
      ]
    }
  ]
}

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
async function add(client, interaction)
{
  const text = interaction.options?.get('text').value;

  const note = new Note({
    guildId: interaction.guild.id,
    userId: interaction.user.id,
    text
  });

  await note.save();

  interaction.reply(`Your note was accepted successfully!`);
}
