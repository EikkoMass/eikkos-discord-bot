const {
  Client,
  Interaction,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  MessageFlags,
} = require("discord.js");
const { getI18n } = require("../../../../utils/i18n");
const getLocalization = (locale) =>
  require(`../../../../i18n/${getI18n(locale)}/notes`);

const Note = require("../../../../models/note");

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
 */
module.exports = async (client, interaction) => {
  try {
    if (!interaction.isModalSubmit()) return;
    if (!interaction.customId?.startsWith("notes;")) return;
    if (!interaction.customId.includes("add;")) return;

    const splittedId = interaction.customId
      .replace("notes;add;", "")
      .split(";");

    const context = splittedId[0] || 1;

    const title = interaction.fields?.getField("title")?.value;
    const description = interaction.fields?.getField("description").value;
    const img = interaction.fields?.getField("img")?.value;

    const words = getLocalization(interaction.locale);

    const note = new Note({
      guildId: interaction.guild.id,
      userId: interaction.user.id,
      type: context,
      creationDate: new Date(),
      img: img || null,
      title,
      text: description,
    });

    await note.save();

    interaction.reply({
      flags: [MessageFlags.Ephemeral],
      embeds: [new EmbedBuilder().setDescription(words.Added)],
    });
  } catch (err) {
    console.log(err);
  }
};
