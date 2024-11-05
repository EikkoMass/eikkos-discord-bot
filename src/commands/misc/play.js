const {Client, Interaction, ApplicationCommandOptionType, EmbedBuilder} = require('discord.js');

const { QueryType } = require('discord-player')

module.exports =  {
  name: 'play',
  description: 'play a song on the voice channel',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    await interaction.deferReply();
    const link = interaction.options.get('link')?.value;


    const queue = client.player.nodes.create(interaction.guild);
    const embed = new EmbedBuilder();

    if (!queue.connection) await queue.connect(interaction.member.voice.channel)

    const result = await client.player.search(link, {
      requestedBy: interaction.user,
      searchEngine: QueryType.SPOTIFY_SONG
    });

    if(!result.tracks.length)
    {
      await interaction.editReply("No results found");
      return;
    }

    const song = result.tracks[0];

    embed
      .setDescription(`Added **[${song.title}]** to the queue.`)
      .setThumbnail(song.thumbnail)
      .setFooter({text: `Duration ${song.duration}`});

      if (!queue.isPlaying()) await queue.play(song)
      
      await interaction.editReply({embeds: [embed]});
  },

  options: [
    {
      name: 'link',
      description: 'link to the song',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ]
}