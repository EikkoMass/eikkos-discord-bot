const {ApplicationCommandOptionType, Client, Interaction, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const Note = require('../../models/note');

module.exports =  { 
  callback: async (client, interaction) => {

    switch(interaction.options.getSubcommand())
    {
      case 'add':
        await add(client, interaction);
        return;
      case 'show':
        await show(client, interaction);
        return;
      case 'remove':
        await remove(client, interaction);
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
      description: 'Register your note',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'text',
          description: 'the information you want to keep',
          type: ApplicationCommandOptionType.String,
        }
      ]
    },
    {
      name: 'show',
      description: 'Show all your notes (privately)',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'remove',
      description: 'removes an note by their ID',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'id',
          description: 'note id (on the footer of the note)',
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
    creationDate: new Date(),
    text
  });

  await note.save();

  interaction.reply({
    ephemeral: true,
    content: `Your note was added successfully!`
  });
}

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
async function show(client, interaction)
{
  const notes = await Note.find({ userId: interaction.user.id, guildId: interaction.guild.id });
  await interaction.deferReply({ ephemeral: true });

  if(notes?.length)
  {
    const embeds = [];

    for (let note of notes)
    {
      embeds.push(
        new EmbedBuilder()
        .setDescription(note.text)
        .setColor('Random')
        .setTimestamp(note.creationDate)
        .setFooter({ text: note._id.toString(), iconURL: interaction.member.displayAvatarURL({size: 256}) })
      )
    }

    interaction.editReply({ embeds });
    return;
  }

  interaction.editReply({
    content: `No notes were found on this server!`,
    ephemeral: true
  });
}

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
async function remove(client, interaction)
{
  const id = interaction.options?.get('id').value;

  const note = await Note.findByIdAndDelete(id).catch(() => {});

  if(note)
  {
    interaction.reply({
      ephemeral: true,
      content: `Your note was removed successfully!`
    });
    return;
  }

  interaction.reply({
    ephemeral: true,
    content: `Note not found!`
  });
}