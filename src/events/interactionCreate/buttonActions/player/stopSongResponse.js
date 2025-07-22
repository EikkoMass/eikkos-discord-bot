const { Client, Interaction, MessageFlags } = require('discord.js');
const { useQueue } = require('discord-player');

const { getI18n } = require("../../../../utils/i18n");
const getLocalization = locale => require(`../../../../i18n/${getI18n(locale)}/stop`);

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
module.exports = async (client, interaction) => {
  try {
    if(!interaction.isButton()) return;
    if(!interaction.customId?.startsWith('player;')) return;
    if(!interaction.customId.includes('stop;')) return;

    const words = getLocalization(interaction.locale);

    await interaction.deferReply({ 
      flags: [ MessageFlags.Ephemeral ],
    }) ;
  
    const queue = useQueue(interaction.guild);

    if (queue.isPlaying()) 
    {
      queue.node.stop();
      await interaction.editReply(`:rock: ${words.Stopped}`); 
    }

    await interaction.editReply({ embeds: [embed.setDescription(`:warning: ${words.NoSongPlaying}`)] });

  } catch (err) {
      console.log(err);
  }
}