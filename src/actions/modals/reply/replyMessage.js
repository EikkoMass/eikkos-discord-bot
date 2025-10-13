import { Client, EmbedBuilder, MessageFlags } from "discord.js";

export default {
  name: "reply",

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const content = JSON.parse(interaction.customId);

      const messageId = content.messageId;

      if (!messageId)
        return interaction.reply({
          embeds: [new EmbedBuilder().setDescription("Invalid message ID")],
          flags: [MessageFlags.Ephemeral],
        });

      const message = await interaction.channel.messages.fetch(messageId);

      const reply = interaction.fields?.getField("description").value;

      await interaction.deferReply();
      await interaction.deleteReply();

      message.reply({
        content: reply,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
