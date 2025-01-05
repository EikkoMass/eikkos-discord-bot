const { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { useQueue } = require('discord-player')

module.exports =  {
  name: 'queue',
  description: 'shows the current song',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    await interaction.deferReply();
    const embed = new EmbedBuilder();

    const queue = useQueue(interaction.guild);

    if(!queue?.channel || !queue?.currentTrack)
    {
      await interaction.editReply({
        embeds: [embed.setDescription("There's no track playing.")],
      });
      return;
    }
    
    const fields = [
      { name: 'Duration',      value: queue.currentTrack.duration,                inline: true  },
      { name: 'Author',        value: queue.currentTrack.author,                  inline: true  },
      { name: 'Views',         value: `${queue.currentTrack.views}`,              inline: true  },
      { name: 'Voice Channel', value: queue.channel.name,                         inline: true  },
      { name: 'Volume',        value: `${queue.node.volume}%`,                    inline: true  },
      { name: 'Requested by',  value: `<@${queue.currentTrack.requestedBy.id}>`,  inline: true  },
    ];

    embed
      .setTitle(`Playing: ${queue.currentTrack.title}`)
      .setDescription(queue.currentTrack.description)
      .setURL(queue.currentTrack.url)
      .setImage(queue.currentTrack.thumbnail)
      .setFields(fields);

    const row = new ActionRowBuilder();


        row.components.push(
          new ButtonBuilder()
            .setCustomId(`player;pause;`)
            .setLabel('⏸️')
            .setStyle(ButtonStyle.Secondary)
        )

        row.components.push(
          new ButtonBuilder()
            .setCustomId(`player;play;`)
            .setLabel('▶️')
            .setStyle(ButtonStyle.Secondary)
        )

        row.components.push(
          new ButtonBuilder()
            .setCustomId(`player;skip;`)
            .setLabel('⏩')
            .setStyle(ButtonStyle.Secondary)
        )

        row.components.push(
          new ButtonBuilder()
            .setCustomId(`player;stop;`)
            .setLabel('⏹️')
            .setStyle(ButtonStyle.Secondary)
        )

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    });
  }

}