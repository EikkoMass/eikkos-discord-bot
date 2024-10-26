require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const eventHandler = require('./handlers/eventHandler');

const client = 
new Client(
  { 
    intents: [
                  GatewayIntentBits.Guilds,
                  GatewayIntentBits.GuildMembers, 
                  GatewayIntentBits.GuildMessages, 
                  GatewayIntentBits.GuildIntegrations, 
                  GatewayIntentBits.MessageContent,
                ] 
    }
);

eventHandler(client);
/*
client.on("messageCreate", async (message) => {
  if(message.author.bot) return;
    // message.reply("Hello");
});
*/


client.on('interactionCreate', async (interaction) => {

  await doButtonRoleAction(interaction);
});

client.on('messageCreate', async message => {

});

async function doButtonRoleAction(interaction)
{
  try {
    if(!interaction.isButton()) return;

    await interaction.deferReply({ ephemeral: true }) ;

    const role = interaction.guild.roles.cache.get(interaction.customId);

    if(!role)
    {
      await interaction.editReply({ content: "I couldn't find that role!"   });
      return;
    }

    const hasRole = interaction.member.roles.cache.has(role.id);

    if(hasRole){
      await interaction.member.roles.remove(role);
      await interaction.editReply(`The role ${role} has been removed.`);
      return;
    }

    await interaction.member.roles.add(role);
    await interaction.editReply(`The role ${role} has been added.`);

  } catch (err) {
      console.log(err);
  }
}

client.login(process.env.DISCORD_TOKEN);
