require('dotenv').config();
const { Client, GatewayIntentBits } = require("discord.js");

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

client.on("ready", (c) => {
  console.log(`Logged in as ${c.user.tag}!`);
});
/*
client.on("messageCreate", async (message) => {
  if(message.author.bot) return;
    // message.reply("Hello");
});
*/


client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'hey') {
    return interaction.reply('hey!');
  }

  if (interaction.commandName === 'add') {
    const num1 = interaction.options.get('first-number')?.value;
    const num2 = interaction.options.get('second-number')?.value;

    return interaction.reply(`sum: ${num1 + num2}`);
  }
});

client.login(process.env.DISCORD_TOKEN);
