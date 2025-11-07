import { EmbedBuilder, Colors, MessageFlags } from "discord.js";

const formats = {
  success: (message) => `:white_check_mark: ${message}`,
  error: (message) => `:x: ${message}`,
  info: (message) => `:information_source: ${message}`,
  warning: (message) => `:warning: ${message}`,
};

const replies = {
  message: {
    success: async (interaction, message, options = {}) => {
      options.embed ??= {};
      options.embed.color ??= Colors.Green;

      await messageBase(interaction, formats.success(message), options);
    },
    error: async (interaction, message, options = {}) => {
      options.embed ??= {};
      options.embed.color ??= Colors.Red;

      await messageBase(interaction, formats.error(message), options);
    },
    info: async (interaction, message, options = {}) => {
      options.embed ??= {};
      options.embed.color ??= Colors.Blue;

      await messageBase(interaction, formats.info(message), options);
    },
    warning: async (interaction, message, options = {}) => {
      options.embed ??= {};
      options.embed.color ??= Colors.Yellow;

      await messageBase(interaction, formats.warning(message), options);
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
  return new EmbedBuilder()
    .setDescription(message)
    .setColor(options?.color ?? Colors.Green);
}

export default replies;
