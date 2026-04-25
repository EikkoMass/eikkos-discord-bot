import { Client } from "discord.js";
import getTypes from "../utils/autocompletes/minecraft/editions.js";

/**
 *  @param {Client} client
 *  @param  interaction
 */
export default {
  name: "minecraft",
  contexts: ["register"],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) =>
    interaction.respond(await getTypes(interaction)).catch(() => {}),
};
