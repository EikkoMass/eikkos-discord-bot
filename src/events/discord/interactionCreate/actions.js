import { Client, EmbedBuilder, MessageFlags } from "discord.js";
import handler from "../../../handlers/action.js";

/**
 *  @param {Client} client
 *  @param  interaction
 */
export default async (client, interaction) => {
  let context = getContext(interaction);
  if (!context) return;

  await handler(client, interaction, context);
};

function getContext(interaction) {
  if (interaction.isButton()) return `buttons`;
  else if (interaction.isModalSubmit()) return `modals`;
  else return null;
}
