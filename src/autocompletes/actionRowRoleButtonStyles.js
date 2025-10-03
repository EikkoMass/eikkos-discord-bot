import { Client } from "discord.js";
import getTypes from "../enums/buttonStyles.js";

export default {
  name: "role",
  contexts: ["add"],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) =>
    interaction.respond(await getTypes(interaction)).catch(() => {}),
};
