import { Client } from "discord.js";
import { getToken } from "../utils/authenticators/igdb.js";

const QUANTITY_OF_RESULTS = 6;

export default {
  name: "game",
  contexts: ["search"],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const token = getToken();

      if (!process.env.IGDB_CLIENT_ID)
        return interaction
          .respond([
            { name: "Environment variable not properly set", value: -1 },
          ])
          .catch(() => {});

      const req = await fetch(`https://api.igdb.com/v4/games`, {
        method: "POST",
        headers: {
          "Client-ID": process.env.IGDB_CLIENT_ID,
          Authorization: `Bearer ${token.access_token}`,
        },
        body: `fields name, id; limit ${QUANTITY_OF_RESULTS}; search "${(interaction.options.getFocused() || "").replace('"', '\\"')}";`,
      });

      const games = await req.json();

      interaction
        .respond(
          (games || []).map((game) => {
            return { name: game.name, value: game.id };
          }),
        )
        .catch(() => {});
    } catch (e) {
      console.log(e);
    }
  },
};
