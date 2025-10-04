import {
  Client,
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} from "discord.js";

export default {
  name: "say",
  description: "Makes the bot say something",
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const message = interaction.options.get("message").value;

    if (!message) {
      interaction.reply({
        embeds: [
          new EmbedBuilder().setDescription("Please provide a message."),
        ],
      });
      return;
    }

    await interaction.deferReply();
    await interaction.deleteReply();

    interaction.channel.send(message);
  },

  options: [
    {
      name: "message",
      description: "Message to say",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};
