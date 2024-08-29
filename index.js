require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

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

  await doButtonRoleAction(interaction);

  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'hey') {
    return interaction.reply('hey!');
  }

  if (interaction.commandName === 'add') {
    const num1 = interaction.options.get('first-number')?.value;
    const num2 = interaction.options.get('second-number')?.value;

    return interaction.reply(`sum: ${num1 + num2}`);
  }

  if (interaction.commandName === 'embed') {
    interaction.reply({embeds: [myCustomEmbed()]});
  }
});

client.on('messageCreate', async message => {
  if(message.content?.includes('$$')) {

    // replies the matched message
    //message.reply({embeds: [myCustomEmbed()]})

    //dont directly replies
    message.channel.send({embeds: [myCustomEmbed()]});
  }
});

function myCustomEmbed()
{
  const bannerURL= 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7sly.jpg';
  const imgURL= 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/440/header.jpg?t=1724200484';

return new EmbedBuilder()
  .setTitle("Embed title")
  .setDescription("This is an embed description")
  .setColor('Random')
  .addFields({name: 'Field title', value: 'Some random value', inline: true}, {name: '2nd Field title', value: 'Some random value', inline: true})
  .setThumbnail(bannerURL)
  .setImage(imgURL);
}

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
