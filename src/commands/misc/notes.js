import {
  ApplicationCommandOptionType,
  Client,
  LabelBuilder,
  MessageFlags,
  ActionRowBuilder,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  FileUploadBuilder,
} from "discord.js";

import getNoteEmbeds from "../../utils/components/getNoteEmbeds.js";
import reply from "../../utils/core/replies.js";
import Note from "../../models/note.js";
import { Types } from "mongoose";

import { getLocalization } from "../../utils/i18n.js";
import getPaginator from "../../utils/components/getPaginator.js";
import NoteTypes from "../../enums/notes/types.js";
import Enum from "../../enums/notes/contexts.js";
import discord from "../../configs/discord.json" with { type: "json" };
import actions from "../../configs/actions.json" with { type: "json" };

const OPTS = {
  add: {
    name: "add",
    description: "Register your note.",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "context",
        description: "where you want to register",
        type: ApplicationCommandOptionType.Integer,
        autocomplete: true,
      },
    ],
  },
  edit: {
    name: "edit",
    description: "Edit an existing note.",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "code",
        description: "where you want to register",
        type: ApplicationCommandOptionType.String,
      },
    ],
  },
  show: {
    name: "show",
    description: "Show the notes (from the guild or your privates)",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "context",
        description: "from where you want to see",
        type: ApplicationCommandOptionType.Integer,
        autocomplete: true,
      },
    ],
  },
  remove: {
    name: "remove",
    description: "removes an note by their ID",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "id",
        description: "note id (on the footer of the note)",
        type: ApplicationCommandOptionType.String,
      },
    ],
  },
};

export default {
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case OPTS.add.name:
        return await add(client, interaction);
      case OPTS.edit.name:
        return await edit(client, interaction);
      case OPTS.show.name:
        return await show(client, interaction);
      case OPTS.remove.name:
        return await remove(client, interaction);
      default:
        return await reply.message.error(
          interaction,
          `Note command not found!`,
        );
    }
  },
  name: "notes",
  description: "Manage your notes by guild",
  options: [OPTS.add, OPTS.edit, OPTS.show, OPTS.remove],
};

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function add(client, interaction) {
  return manageNote(client, interaction, NoteTypes.ADD);
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function edit(client, interaction) {
  const code = interaction.options.get("code").value;
  return manageNote(client, interaction, NoteTypes.EDIT, code);
}

/**
 *  @param {Client} client
 *  @param  interaction
 *  @param {number} action
 *  @param {string} code
 */
async function manageNote(client, interaction, action, code = null) {
  const context = interaction.options?.get("context")?.value || 1;
  const words = await getLocalization(interaction.locale, `notes`);

  let query = {
    guildId: interaction.guild.id,
    type: context,
  };

  if (context === Enum.PRIVATE) {
    query.userId = interaction.user.id;
  }

  let countNotes = await Note.countDocuments(query);

  if (context === Enum.PRIVATE && countNotes >= discord.embeds.max) {
    return await reply.message.error(interaction, words.LimitExceeded);
  }

  const title = new TextInputBuilder()
    .setCustomId("title")
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

  const description = new TextInputBuilder()
    .setCustomId("description")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const img = new FileUploadBuilder()
    .setCustomId("img")
    .setMinValues(1)
    .setMaxValues(1)
    .setRequired(false);

  let hasImg = false;

  if (code) {
    let note = await Note.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
      _id: new Types.ObjectId(`${code}`),
    });

    if (note) {
      if (note.title) title.setValue(note.title);
      description.setValue(note.text);
      hasImg = !!note.img;
    } else {
      return await reply.message.error(interaction, words.NotFound);
    }
  }

  const id = action === NoteTypes.ADD ? actions.notes.add : actions.notes.edit;

  const hashSize = 6;
  const hash = Math.random()
    .toString(36)
    .substring(2, hashSize + 2);

  const labels = [
    new LabelBuilder({
      label: words.Title,
      component: title,
    }),
    new LabelBuilder({
      label: words.NoteInfo,
      component: description,
    }),
  ];

  if (action === NoteTypes.ADD || (action === NoteTypes.EDIT && !hasImg)) {
    labels.push(
      new LabelBuilder({
        label: words.Image,
        component: img,
      }),
    );
  }

  const modal = new ModalBuilder()
    .setCustomId(
      JSON.stringify({
        id,
        context,
        code,
        hash,
      }),
    )
    .setTitle(getTitle(words, context, action))
    .setLabelComponents(labels);

  await interaction.showModal(modal);
}

function getTitle(words, context, action) {
  if (action === NoteTypes.ADD) {
    return context === Enum.PRIVATE
      ? words.NewPrivateNote
      : words.NewPublicNote;
  } else {
    return context === Enum.PRIVATE
      ? words.EditPrivateNote
      : words.EditPublicNote;
  }
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function show(client, interaction) {
  const words = await getLocalization(interaction.locale, `notes`);

  const context = interaction.options?.get("context")?.value || Enum.PRIVATE;

  let query = {
    guildId: interaction.guild.id,
    type: context,
  };

  if (context === Enum.PRIVATE) {
    query.userId = interaction.user.id;
  }

  let row = new ActionRowBuilder();

  let countNotes = await Note.countDocuments(query);
  const notes = await Note.find(query)
    .sort({ _id: -1 })
    .limit(discord.embeds.max);

  await interaction.deferReply({
    flags: context === Enum.PRIVATE ? [MessageFlags.Ephemeral] : [],
  });

  if (notes?.length) {
    const embeds = await getNoteEmbeds(client, notes);
    const minPage = 1;

    if (context === Enum.PUBLIC) {
      row = getPaginator(
        {
          id: actions.notes.show,
          context,
        },
        countNotes,
        minPage,
        discord.embeds.max,
      );
    }

    return interaction.editReply({
      embeds,
      components: row.components?.length ? [row] : [],
    });
  }

  await reply.message.error(interaction, words.NotFoundInServer, {
    context: "editReply",
  });
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function remove(client, interaction) {
  const id = interaction.options?.get("id").value;

  const words = await getLocalization(interaction.locale, `notes`);

  const note = await Note.findById(id);

  if (
    note.guildId !== interaction.guild.id ||
    (note.type === Enum.PRIVATE && note.userId !== interaction.user.id)
  ) {
    return await reply.message.error(interaction, words.NotFound);
  }

  if (note) {
    await Note.deleteOne({ _id: note._id });
    return await reply.message.success(interaction, words.Removed);
  }

  await reply.message.error(interaction, words.NotFound);
}
