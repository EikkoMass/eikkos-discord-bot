import reply from "../../utils/core/replies.js";
import Enum from "../../enums/notify/aliases.js";

import NotifyAlias from "../../models/notifyAlias.js";
import Notify from "../../models/notify.js";

import { Types } from "mongoose";

export default {
  name: "kick",
  description: "Sends the Kick alias notification",

  callback: async (client, interaction) => {
    const alias = await NotifyAlias.findOne({
      guildId: interaction.guild.id,
      type: Enum.KICK,
    });

    if (!alias) {
      return reply.message.error(interaction, "No Kick alias found");
    }

    const notify = await Notify.findOne({
      guildId: interaction.guild.id,
      _id: alias.notificationId,
    });

    if (!notify) {
      return reply.message.error(interaction, "No Kick notification found");
    }

    await interaction.deferReply();
    await interaction.deleteReply();

    interaction.channel.send(notify.message);
  },
};
