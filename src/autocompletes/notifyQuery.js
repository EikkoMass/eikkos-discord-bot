import { Client } from "discord.js";
import Notify from "../models/notify.js";

import discord from "../configs/discord.json" with { type: "json" };

export default {
  name: "notify",
  contexts: ["send"],
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const search = interaction.options.getFocused();

      var notifications = await Notify.find({
        guildId: interaction.guild.id,
        $or: [
          { title: { $regex: `.*${search}.*`, $options: "i" } },
          { message: { $regex: `.*${search}.*`, $options: "i" } },
        ],
      }).limit(discord.autocompletes.max);

      if (notifications) {
        let options = notifications.map((notification) => {
          return {
            name: notification.title ?? notification._id.toString(),
            value: notification._id.toString(),
          };
        });
        interaction
          .respond(options.slice(0, discord.autocompletes.max))
          .catch(() => {});
      }
    } catch (err) {
      console.log(err);
    }
  },
};
