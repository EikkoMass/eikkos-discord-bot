import { Client } from "discord.js";
import getTypes from "../utils/autocompletes/notify/aliases.js";

/**
 *  @param {Client} client
 *  @param  interaction
 */
export default {
  name: "notify",
  contexts: [
    {
      name: "alias",
      contexts: [
        { name: "add", contexts: ["context"] },
        { name: "remove", contexts: ["context"] },
      ],
    },
  ],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    interaction.respond(await getTypes(interaction)).catch((e) => {});
  },
};
