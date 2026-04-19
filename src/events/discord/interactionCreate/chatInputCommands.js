import handler from "../../../handlers/chatInputCommand.js";

/**
 *  @param {Client} client
 *  @param  interaction
 */
export default async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  await handler(client, interaction);
};
