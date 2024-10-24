const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {

    /** 
   * 
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    const mentionable = interaction.options.get('target-user').value;
    const duration = interaction.options.get('duration').value;
    const reason = interaction.options.get('reason')?.value || "No reason provided";

    await interaction.deferReply();

    const targetUser  = await interaction.guild.members.fetch(mentionable);

    if(!targetUser)
    {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if(targetUser.user.bot)
      {
        await interaction.editReply("I can't timeout a bot.");
        return;
      }

      const msDuration = ms(duration);
      if(isNaN(msDuration))
      {
        await interaction.editReply("Please provide a valid timeout duration.");
        return;
      }

      if(msDuration < 5000 || msDuration > 2.419e9)
      {
        await interaction.editReply("Timeout duration cannot be last than 5s or 28 days.");
        return;
      }

      const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user;
      const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd;
      const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot;
  
      if(targetUserRolePosition >= requestUserRolePosition)
      {
        await interaction.editReply("You can't timeout that user because they have same / higher role than you.");
        return;
      }
  
      if(targetUserRolePosition >= botRolePosition)
      {
        await interaction.editReply("I can't timeout that user because they have the same / higher role than me.");
        return;
      }

      //timeout the user 
      try {
        const {default: prettyMs} = await import('pretty-ms');

        if(targetUser.isCommunicationDisabled())
        {
          await targetUser.timeout(msDuration, reason);
          await interaction.editReply(`${targetUser}'s timeout has been updated to ${prettyMs(msDuration, {verbose: true})}`);
          return;
        }

        await targetUser.timeout(msDuration, reason);
        await interaction.editReply(`${targetUser} was timed out for ${prettyMs(msDuration, {verbose: true})}\nReason: ${reason}`);

      } catch(e) {
          console.log(`There was an error when timing out: ${e}`);
      }
  },

  name: 'timeout',
  description: 'Timeout a user.',
  options: [
    {
      name: 'target-user',
      description: 'The user you want to timeout',
      type: ApplicationCommandOptionType.Mentionable,      
      required: true
    },
    {
      name: 'duration',
      description: 'Timeout duration (30minute , 1hour , 1 day)',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'reason',
      description: 'The reason for the timeout',
      type: ApplicationCommandOptionType.String,
    }
  ],
  permissionsRequired: [ PermissionFlagsBits.MuteMembers ],
  botPermissions: [ PermissionFlagsBits.MuteMembers ],
}