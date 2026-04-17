import { Client } from "discord.js";
import discord from "../configs/discord.json" with { type: "json" };

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
        `https://api.jikan.moe/v4/anime?q=${interaction.options.getFocused()}&limit=${discord.autocompletes.max}`,
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
