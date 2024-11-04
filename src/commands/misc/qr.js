const {Client, Interaction, ApplicationCommandOptionType} = require('discord.js');


module.exports =  {
  name: 'qr',
  description: 'Replies a QR code from the link',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const scale = interaction.options.get('scale')?.value || 1;
    const link = interaction.options.get('link')?.value;

    const size = 150 * scale;

    interaction.editReply(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${link}`);
  },

  options: [
    {
      name: 'link',
      description: 'link to the QR code',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'scale',
      description: 'scale of the QR code img',
      type: ApplicationCommandOptionType.Integer,
    }
  ]
}