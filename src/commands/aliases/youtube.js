import reply from "../../utils/core/replies.js";
import Enum from "../../enums/notify/aliases.js";

import NotifyAlias from "../../models/notifyAlias.js";
import Notify from "../../models/notify.js";

export default {
  name: "youtube",
  description: "Sends the YouTube alias notification",

  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, "youtube");

    const alias = await NotifyAlias.findOne({
      guildId: interaction.guild.id,
      type: Enum.YOUTUBE,
    });

    if (!alias) {
      return await reply.message.error(interaction, words.AliasNotFound);
    }

    const notify = await Notify.findOne({
      guildId: interaction.guild.id,
      _id: alias.notificationId,
    });

    if (!notify) {
      return await reply.message.error(interaction, words.NotificationNotFound);
    }

    await interaction.deferReply();
    await interaction.deleteReply();

    interaction.channel.send(notify.message);
  },
};
