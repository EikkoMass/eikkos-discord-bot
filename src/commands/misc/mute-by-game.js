import {
  Client,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} from "discord.js";
import MuteByGame from "../../models/muteByGame.js";

import reply from "../../utils/core/replies.js";

import { getLocalization } from "../../utils/i18n.js";

export default {
  name: "mute-by-game",
  description: "play a song on the voice channel",

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `mute-by-game`);

    const gameName = interaction.options.get("game").value;
    let activate = interaction.options.get("activate")?.value;

    if (activate === undefined) activate = true;

    let data = await MuteByGame.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
      gameName: gameName,
    });

    if (activate) {
      if (data) {
        return await reply.message.info(interaction, words.AlreadyActive);
      } else {
        data = new MuteByGame({
          userId: interaction.user.id,
          gameName,
          guildId: interaction.guild.id,
        });

        data.save();

        await reply.message.success(interaction, words.Registered);
      }
    } else {
      if (data) {
        await MuteByGame.findOneAndDelete({
          userId: interaction.user.id,
          guildId: interaction.guild.id,
          gameName: gameName,
        });

        return await reply.message.success(interaction, words.Disabled);
      }

      return await reply.message.info(interaction, words.AlreadyDisabled);
    }
  },

  options: [
    {
      name: "game",
      description: "game name you want to config",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
    {
      name: "activate",
      description: "if you want the option enabled or disabled",
      type: ApplicationCommandOptionType.Boolean,
    },
  ],
  botPermissions: [PermissionFlagsBits.MuteMembers],
};
