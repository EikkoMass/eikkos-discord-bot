import {
  Client,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import ms from "ms";

export default {
  name: "disconnect",
  description: "Disconnects the user from the voice channel",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const embed = new EmbedBuilder();

    let timer = interaction.options.get("timer")?.value || "0 seconds";
    let member = interaction.options.get("user")?.value;

    console.log(member);
    console.log(timer);

    if (member) {
      member = await interaction.guild.members.fetch(member);
    }

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.MoveMembers) &&
      member.user.id !== interaction.user.id &&
      !member.user.bot
    ) {
      interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [embed.setDescription("Missing permissions")],
      });
      return;
    }

    if (!member?.voice?.channel) {
      interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [embed.setDescription("Must be in voice channel")],
      });
      return;
    }

    const duration = ms(timer);
    const { default: prettyMs } = await import("pretty-ms");

    const formattedDuration = prettyMs(duration, { verbose: true });

    interaction.reply({
      flags: [MessageFlags.Ephemeral],
      embeds: [embed.setDescription("Disconnecting...")],
    });

    setTimeout(() => {
      member.voice.disconnect();
    }, duration);
  },

  options: [
    {
      name: "user",
      description: "the user you want to disconnect",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "timer",
      description:
        "the time to disconnect the user (30 minutes , 1 hour , 1 day)",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
};
