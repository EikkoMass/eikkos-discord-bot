import reply from "../../utils/core/replies.js";
import Enum from "../../enums/notify/aliases.js";

import NotifyAlias from "../../models/notifyAlias.js";
import Notify from "../../models/notify.js";

export default {
  name: "youtube",
  description: "Sends the YouTube alias notification",

  callback: async (client, interaction) => {
    const alias = await NotifyAlias.findOne({
      guildId: interaction.guild.id,
      type: Enum.YOUTUBE,
    });

    if (!alias) {
      return reply.message.error(interaction, "No YouTube alias found");
    }

    const notify = await Notify.findOne({
      guildId: interaction.guild.id,
      _id: alias.notificationId,
    });

    if (!notify) {
      return reply.message.error(interaction, "No YouTube notification found");
    }

    await interaction.deferReply();
    await interaction.deleteReply();

    interaction.channel.send(notify.message);
  },
};
