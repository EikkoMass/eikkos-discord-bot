const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports =  {

  /** 
   * 
   *  @param {Client} client
   *  @param {Interaction} interaction
  */

  callback: async (client, interaction) => {

    const embed = new EmbedBuilder();
    const targetUserId = interaction.options.get('target-user').value;
    const reason = interaction.options.get('reason')?.value || "No reason provided.";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if(!targetUser)
    {
      await interaction.editReply({
        embeds: [embed.setDescription("That user doesn't exist in this server.")]
      });
      return;
    }

    if(targetUser.id === interaction.guild.ownerId)
    {
      await interaction.editReply({
        embeds: [embed.setDescription("You can't kick that user because they're the server owner.")]
      });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user;
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd;
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot;

    if(targetUserRolePosition >= requestUserRolePosition)
    {
      await interaction.editReply({
        embeds: [embed.setDescription("You can't kick that user because they have same / higher role than you.")]
      });
      return;
    }

    if(targetUserRolePosition >= botRolePosition)
    {
      await interaction.editReply({
        embeds: [embed.setDescription("I can't kick that user because they have the same / higher role than me.")]
      });
      return;
    }

    //Ban the targetUser
    try{
      await targetUser.kick(reason);
      
      await interaction.editReply({
        embeds: [embed.setDescription(`User ${targetUser} was kicked\nReason: ${reason}`)]
      });
    }catch(e)
    {
      console.log(`There was an error when kicking: ${e}`);
      
      await interaction.editReply({
        embeds: [embed.setDescription(`User ${targetUser} could not be kicked`)]
      });
    }
  },

  name: 'kick',
  description: 'kicks a member from this server..',
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: 'target-user',
      description: 'The user you want to kick.',
      required: true,
      type: ApplicationCommandOptionType.Mentionable
    },    
    {
      name: 'reason',
      description: 'The reason you want for kick.',
      type: ApplicationCommandOptionType.String
    }
  ],
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],
}