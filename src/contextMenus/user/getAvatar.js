import {Client, MessageFlags, InteractionContextType, ApplicationCommandType} from 'discord.js';

export default {
  name: "Get Avatar",
  contexts: [InteractionContextType.Guild],
  type: ApplicationCommandType.User,

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    return interaction.reply({
      flags: [ MessageFlags.Ephemeral ],
      content: interaction.targetUser.displayAvatarURL({ size: 256 })
    })
  }
}