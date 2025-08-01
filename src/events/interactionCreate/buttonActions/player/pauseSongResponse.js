const { Client, Interaction, MessageFlags, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

const { getI18n } = require("../../../../utils/i18n");
const getLocalization = locale => require(`../../../../i18n/${getI18n(locale)}/pause`);

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
module.exports = async (client, interaction) => {
  try {
      if(!interaction.isButton()) return;
      if(!interaction.customId?.startsWith('player;')) return;
      if(!interaction.customId.includes('pause;')) return;

      const words = getLocalization(interaction.locale);

      await interaction.deferReply({ 
        flags: [ MessageFlags.Ephemeral ], 
      }) ;
    
      const queue = useQueue(interaction.guild);

      if(!queue || !queue.node)
      {
        await interaction.editReply({
          embeds: [new EmbedBuilder().setDescription(":x: " + words.NoQueue)],
        });
        return;
      }

      if(!queue.node.isPlaying()){
        await interaction.editReply({
          embeds: [new EmbedBuilder().setDescription(words.AlreadyPaused)]
        });
        return;
      }
  
      queue.node.pause();
      await interaction.editReply({
        embeds: [new EmbedBuilder().setDescription(words.Paused)]
      });
  
    } catch (err) {
        console.log(err);
    }
}