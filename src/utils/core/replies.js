import { EmbedBuilder, Colors, MessageFlags } from "discord.js";

export default {
  successMessage,
  errorMessage,
};

export async function successMessage(interaction, message, options = {}) {
  await interaction.reply({
    flags: options?.flags ?? [MessageFlags.Ephemeral],
    embeds: [newMessageEmbed(message)],
  });
}
export async function errorMessage(interaction, message, options = {}) {
  await interaction.reply({
    flags: options?.flags ?? [MessageFlags.Ephemeral],
    embeds: [newMessageEmbed(message, Colors.Red)],
  });
}

function newMessageEmbed(message, color = Colors.Green) {
  return new EmbedBuilder().setDescription(message).setColor(color);
}
