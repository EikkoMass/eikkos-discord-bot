import getActions from "../../utils/importers/getLocalActions.js";
import { Client, EmbedBuilder, MessageFlags } from "discord.js";

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
  const splittedId = customId.id.split(";");

  const action = actions.find((cmd) => {
    if (!customId.id.startsWith(cmd.name + ";")) return false;
    if (cmd.tags && !cmd.tags.every((tag) => splittedId.includes(tag)))
      return false;

    return true;
  });

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
