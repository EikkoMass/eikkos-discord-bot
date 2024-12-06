const {Client, Interaction, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
require('dotenv').config();

//TODO Dynamic

const roles = [
  {
    id: process.env.RED_ROLE_ID,
    label: 'Red'
  },
  {
    id: process.env.GREEN_ROLE_ID,
    label: 'Green'
  },
  {
    id: process.env.BLUE_ROLE_ID,
    label: 'Blue'
  }
];

module.exports = {

  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {

    try {
      const channel = await client.channels.cache.get(process.env.CHANNEL_ID);
      if(!channel) return;
        
      const row = new ActionRowBuilder();

      roles.forEach(role => row.components.push( new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary) ));
      await interaction.reply(
        {
          content: 'Claim of remove a role below',
          components: [row],
      });

    } catch (error) {
      console.log(error);
    } 
  },

  name: 'set-role',
  description: 'Set a new role.',
}