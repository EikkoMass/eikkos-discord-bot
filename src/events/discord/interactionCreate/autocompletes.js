import { Client } from "discord.js";
import handler from "../../../handlers/autocomplete.js";

/**
 *  @param {Client} client
 *  @param  interaction
 */
export default async (client, interaction) => {
  if (!interaction.isAutocomplete()) return;

  await handler(client, interaction);
};
