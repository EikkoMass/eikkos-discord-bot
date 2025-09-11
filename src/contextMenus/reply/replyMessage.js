import {
  PermissionFlagsBits,
  ActionRowBuilder,
  TextInputBuilder,
  ModalBuilder,
  InteractionContextType,
  ApplicationCommandType,
  TextInputStyle,
} from "discord.js";

export default {
  name: "Reply Message",
  contexts: [InteractionContextType.Guild],
  type: ApplicationCommandType.Message,

  permissionsRequired: [PermissionFlagsBits.ManageMessages],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const description = new TextInputBuilder()
      .setCustomId("description")
      .setLabel("What you want to reply?")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const modal = new ModalBuilder()
      .setTitle("Reply Message")
      .setCustomId(
        `reply;${interaction.targetMessage.id};${crypto.randomUUID()}`,
      )
      .setComponents(new ActionRowBuilder().addComponents(description));

    await interaction.showModal(modal);
  },
};
