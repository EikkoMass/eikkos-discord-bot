import { Client, EmbedBuilder, MessageFlags } from "discord.js";

export default {
  name: "reply",

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const splittedId = interaction.customId.replace("reply;", "").split(";");

      const messageId = splittedId[0];

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
