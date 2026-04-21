import { Client } from "discord.js";
import handler from "../../../handlers/contextMenu.js";

/**
 *  @param {Client} client
 *  @param  interaction
 */
export default async (client, interaction) => {
  if (!interaction.isContextMenuCommand()) return;

  await handler(client, interaction);
};
