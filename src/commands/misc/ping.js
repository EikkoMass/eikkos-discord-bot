import { Colors } from "discord.js";
import reply from "../../utils/core/replies.js";

import discord from "../../configs/discord.json" with { type: "json" };

export default {
  name: "ping",
  description: "Replies with the bot ping!!",
  // devOnly: Boolean,
  // testOnly: Boolean,
  // deleted: Boolean,
  // options: Object[],

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const fReply = await interaction.fetchReply();

    const ping = fReply.createdTimestamp - interaction.createdTimestamp;

    reply.message.success(
      interaction,
      `Pong! Client ${ping}ms | Websocket ${client.ws.ping}ms`,
      {
        context: discord.replies.edit,
        embed: {
          color: Colors.Red,
          emoji: "🏓",
        },
      },
    );
  },
};
