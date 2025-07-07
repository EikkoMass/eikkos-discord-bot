const {ApplicationCommandOptionType, Client, Interaction, EmbedBuilder, MessageFlags } = require('discord.js');
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
          flags: [ MessageFlags.Ephemeral ],
          content: `Note command not found!`
        });
        return;
    }

  },
  name: 'note',
  description: 'Manage your notes by guild',
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
          required: true
        },
        {
          name: 'image',
          description: 'Add an embedded image to the note',
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
  const img = interaction.options?.get('image')?.value;

  const note = new Note({
    guildId: interaction.guild.id,
    userId: interaction.user.id,
    creationDate: new Date(),
    img: img || null,
    text
  });

  await note.save();

  interaction.reply({
    flags: [ MessageFlags.Ephemeral ],
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
  await interaction.deferReply({ 
    flags: [ MessageFlags.Ephemeral ], 
  });

  if(notes?.length)
  {
    const embeds = [];

    for (let note of notes)
    {
      let embed = new EmbedBuilder()
      .setDescription(note.text)
      .setColor('Random')
      .setTimestamp(note.creationDate)
      .setFooter({ text: note._id.toString(), iconURL: interaction.member.displayAvatarURL({size: 256}) });

      if(note.img) embed.setThumbnail(note.img);

      embeds.push(embed)
    }

    interaction.editReply({ embeds });
    return;
  }

  interaction.editReply({
    content: `No notes were found on this server!`,
    flags: [ MessageFlags.Ephemeral ],
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
      flags: [ MessageFlags.Ephemeral ],
      content: `Your note was removed successfully!`
    });
    return;
  }

  interaction.reply({
    flags: [ MessageFlags.Ephemeral ],
    content: `Note not found!`
  });
}