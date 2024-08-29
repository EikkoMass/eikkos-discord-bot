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
    id: 111,
    label: 'Red'
  },
  {
    id: 222,
    label: 'Green'
  },
  {
    id: 333,
    label: 'Blue'
  }
];

client.on("ready", async (c) => {
  
    try {
      const channel = await client.channels.cache.get('111');
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



client.on('interactionCreate', async (interaction) => {
  if(!interaction.isButton()) return;

  await interaction.deferReply({ ephemeral: true }) ;

  const role = interaction.guild.roles.cache.get(interaction.customId);

  if(!role)
  {
    interaction.editReply({ content: 'I couldnt find that role!'    });
    return;
  }

  interaction
});

client.on('messageCreate', message => {
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

client.login(process.env.DISCORD_TOKEN);
