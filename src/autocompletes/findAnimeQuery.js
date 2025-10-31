import { Client } from "discord.js";

const QUANTITY_OF_RESULTS = 6;

export default {
  name: "anime",
  contexts: ["search", "character"],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const req = await fetch(
        `https://api.jikan.moe/v4/anime?q=${interaction.options.getFocused()}&limit=${QUANTITY_OF_RESULTS}`,
        { method: "GET" },
      );

      const animes = await req.json();

      interaction
        .respond(
          (animes?.data || []).map((anime) => {
            return { name: anime.title, value: anime.mal_id };
          }),
        )
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  },
};
