import {
  Client,
  InteractionContextType,
  ApplicationCommandType,
} from "discord.js";
import emojis from "../../utils/core/emojis.js";

export default {
  name: "React message",
  contexts: [InteractionContextType.Guild],
  type: ApplicationCommandType.Message,

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const message = await interaction.channel.messages.fetch(
      interaction.targetId,
    );

    await interaction.deferReply();
    await interaction.deleteReply();

    await message.react(emojis.get("upvote", "👍"));
    await message.react(emojis.get("downvote", "👎"));
  },
};
