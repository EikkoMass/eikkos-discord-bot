import { EmbedBuilder, Colors, MessageFlags } from "discord.js";

const formats = {
  success: {
    embed: {
      color: Colors.Green,
      emoji: ":white_check_mark:",
    },
  },
  error: {
    embed: {
      color: Colors.Red,
      emoji: ":x:",
    },
  },
  info: {
    embed: {
      color: Colors.Blue,
      emoji: ":information_source:",
    },
  },
  warning: {
    embed: {
      color: Colors.Yellow,
      emoji: ":warning:",
    },
  },
};

const replies = {
  message: {
    success: async (interaction, message, options = {}) => {
      const layout = formats.success;
      await messageBase(interaction, message, { ...layout, ...options });
    },
    error: async (interaction, message, options = {}) => {
      const layout = formats.error;
      await messageBase(interaction, message, { ...layout, ...options });
    },
    info: async (interaction, message, options = {}) => {
      const layout = formats.info;
      await messageBase(interaction, message, { ...layout, ...options });
    },
    warning: async (interaction, message, options = {}) => {
      const layout = formats.warning;
      await messageBase(interaction, message, { ...layout, ...options });
    },
    base: messageBase,
  },
};

async function messageBase(interaction, message, options = {}) {
  await interaction[`${options?.context ?? "reply"}`]({
    flags: options?.flags ?? [MessageFlags.Ephemeral],
    embeds: [newMessageEmbed(message, options?.embed)],
  });
}

function newMessageEmbed(message, options = {}) {
  const description = options?.emoji ? `${options.emoji} ${message}` : message;

  return new EmbedBuilder()
    .setDescription(description)
    .setColor(options?.color ?? Colors.Green);
}

export default replies;
