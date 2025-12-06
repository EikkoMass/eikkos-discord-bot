import { Client } from "discord.js";
import editions from "../utils/autocompletes/minecraft/editions.js";

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
  callback: (client, interaction) =>
    interaction.respond(editions).catch(() => {}),
};
