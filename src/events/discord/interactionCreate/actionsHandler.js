import getActions from "../../../utils/importers/getLocalActions.js";
import { Client, EmbedBuilder, MessageFlags } from "discord.js";
import cache from "../../../utils/cache/actions.js";

/**
 *  @param {Client} client
 *  @param  interaction
 */
export default async (client, interaction) => {
  let context = getContext(interaction);

  if (!context) return;

  let actions = await getActions(context);

  if (!interaction.customId) return reply(interaction, `No custom ID found`);

  const customId = JSON.parse(interaction.customId);
  const cacheBase = `${context}_${customId.id}`;
  const splittedId = customId.id.split(";");

  let action = cache.get(cacheBase);

  if (!action && !cache.searched(cacheBase)) {
    action = actions.find((cmd) => {
      if (!customId.id.startsWith(cmd.name + ";")) return false;
      if (cmd.tags && !cmd.tags.every((tag) => splittedId.includes(tag)))
        return false;

      return true;
    });
    cache.set(cacheBase, action);
  }

  if (!action) return reply(interaction, `No action found`);

  await action.callback(client, interaction);
};

function getContext(interaction) {
  if (interaction.isButton()) return `buttons`;
  else if (interaction.isModalSubmit()) return `modals`;
  else return null;
}

function reply(interaction, message) {
  interaction.reply({
    embeds: [new EmbedBuilder().setDescription(message)],
    flags: [MessageFlags.Ephemeral],
  });
}
