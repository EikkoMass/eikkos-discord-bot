import { Client } from "discord.js";
import getTypes from "../utils/autocompletes/buttons/styles.js";

export default {
  name: "role",
  contexts: [{ name: "add", contexts: ["style"] }],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) =>
    interaction.respond(await getTypes(interaction)).catch(() => {}),
};
