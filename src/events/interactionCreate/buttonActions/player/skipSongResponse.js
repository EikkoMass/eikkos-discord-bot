const { Client, Interaction, MessageFlags, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

const { getI18n } = require("../../../../utils/i18n");
const getLocalization = locale => require(`../../../../i18n/${getI18n(locale)}/skip`);

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
module.exports = async (client, interaction) => {
  try {
    if(!interaction.isButton()) return;
    if(!interaction.customId?.startsWith('player;')) return;
    if(!interaction.customId.includes('skip;')) return;

    const words = getLocalization(interaction.locale);

    await interaction.deferReply({ 
      flags: [ MessageFlags.Ephemeral ], 
    });
  
    const queue = useQueue(interaction.guild);
  
    if(!queue || queue.isEmpty())
    {
      await interaction.editReply({
        embeds: [new EmbedBuilder().setDescription(words.NoSong)],
      });
      return;
    }


    queue.node.skip();
    await interaction.editReply({
      embeds: [ new EmbedBuilder().setDescription(`:fast_forward: ${words.Skipped}`) ]
    });
  
  } catch (err) {
      console.log(err);
  }
}