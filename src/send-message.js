require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const client = 
new Client(
  { 
    intents: [
                  GatewayIntentBits.Guilds,
                  GatewayIntentBits.GuildMembers, 
                  GatewayIntentBits.GuildMessages, 
                  GatewayIntentBits.GuildIntegrations, 
                  GatewayIntentBits.MessageContent
                ] 
    }
);

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

client.on("ready", async (c) => {
  
    try {
      const channel = await client.channels.cache.get(process.env.CHANNEL_ID);
      if(!channel) return;
        
      const row = new ActionRowBuilder();

      roles.forEach(role => row.components.push( new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary) ));
      await channel.send(
        {
          content: 'Claim of remove a role below',
          components: [row],
      });

      process.exit();

    } catch (error) {
      console.log(error);
    }

});

client.login(process.env.DISCORD_TOKEN);
