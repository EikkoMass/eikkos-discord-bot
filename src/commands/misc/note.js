const {ApplicationCommandOptionType, Client, Interaction, EmbedBuilder, MessageFlags } = require('discord.js');
const Note = require('../../models/note');

const { getI18n } = require("../../utils/i18n");
const getLocalization = locale => require(`../../i18n/${getI18n(locale)}/note`);

let userCache = [];

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
  name: 'notes',
  description: 'Manage your notes by guild.',
  options: [
    {
      name: 'add',
      description: 'Register your note.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'text',
          description: 'the information you want to keep',
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: 'context',
          description: 'where you want to register',
          type: ApplicationCommandOptionType.Integer,
          autocomplete: true
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
      description: 'Show the notes (from the guild or your privates)',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'context',
          description: 'from where you want to see',
          type: ApplicationCommandOptionType.Integer,
          autocomplete: true
        },
      ]
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
  const context = interaction.options?.get('context')?.value || 1;
  const img = interaction.options?.get('image')?.value;

  const words = getLocalization(interaction.locale);

  const note = new Note({
    guildId: interaction.guild.id,
    userId: interaction.user.id,
    type: context,
    creationDate: new Date(),
    img: img || null,
    text
  });

  await note.save();

  interaction.reply({
    flags: [ MessageFlags.Ephemeral ],
    embeds: [ new EmbedBuilder().setDescription(words.Added) ]
  });
}

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
async function show(client, interaction)
{
  const words = getLocalization(interaction.locale);

  const context = interaction.options?.get('context')?.value || 1;

  let query = {
    guildId: interaction.guild.id,
    type: context,
  }

  if(context == 1)
  {
    query.userId = interaction.user.id;
  }

  const notes = await Note.find(query);
  await interaction.deferReply({ 
    flags: [ MessageFlags.Ephemeral ], 
  });

  if(notes?.length)
  {
    const embeds = [];

    for (let note of notes)
    {
      const owner = (await getUser(client, note.userId)) || client.user;

      let embed = new EmbedBuilder()
      .setDescription(note.text)
      .setColor('Random')
      .setTimestamp(note.creationDate)
      .setFooter({ text: note._id.toString(), iconURL: owner.displayAvatarURL({size: 256}) });

      if(note.img) embed.setThumbnail(note.img);

      embeds.push(embed)
    }

    userCache = [];
    interaction.editReply({ embeds });
    return;
  }

  interaction.editReply({
    embeds: [ new EmbedBuilder().setDescription(words.NotFoundInServer) ],
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

  const words = getLocalization(interaction.locale);

  const note = await Note.findByIdAndDelete(id).catch(() => {});

  if(note)
  {
    interaction.reply({
      flags: [ MessageFlags.Ephemeral ],
      embeds: [ new EmbedBuilder().setDescription(words.Removed) ]
    });
    return;
  }

  interaction.reply({
    flags: [ MessageFlags.Ephemeral ],
    embeds: [ new EmbedBuilder().setDescription(words.NotFound) ]
  });
}

async function getUser(client, userId)
{

  let user = userCache.find(user => user.id == userId);

  if(!user)
  {
    try {
      user = await client.users.cache.get(userId, { force: true, cache: true });
      userCache[userId] = user;
    }
    catch(e) {
      console.log(`usuario nao encontrado: ${e}`);
    }
  }

  return userCache[userId];
}