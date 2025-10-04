import { Client } from "discord.js";
import RoleContext from "../models/roleContext.js";
import { getLocalization } from "../utils/i18n.js";

export default {
  name: "role",
  contexts: ["remove", "choose"],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const words = await getLocalization(interaction.locale, `role`);

      const contexts = await RoleContext.find({
        name: { $regex: ".*" + interaction.options.getFocused() + ".*" },
        guildId: interaction.guild.id,
      });

      interaction
        .respond([
          { name: words.None, value: "" },
          ...contexts.map((context) => {
            return { name: context.name, value: context._id.toString() };
          }),
        ])
        .catch(() => {});
    } catch (e) {
      console.log(e);
    }
  },
};
