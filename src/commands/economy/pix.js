const {Client, Interaction, ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder} = require('discord.js');
const crcs = require('../../utils/crcs');

module.exports = {

  // Heavily inspired by https://github.com/EnssureIT/faz-um-pix

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction) => {
    try{
      const key = interaction.options.get('key')?.value;
      const optDescription = interaction.options.get('description')?.value || "";
      const optName = interaction.options.get('name')?.value.substring(0, 25);
      const optCity = interaction.options.get('city')?.value.substring(0, 25);
      const optAmount = interaction.options.get('value')?.value.toFixed(2);

      const format = "000201"; // Payload Format Indicator
      const gui = "0014br.gov.bcb.pix"; // GUI
      
      const pixKey = `01${getSafeLength(key) + key}`;
      const info = optDescription.length > 0 ? "02" + getSafeLength(optDescription) + optDescription.substring(0, 50) : "";
      const account = "26" + (gui.length + pixKey.length + info.length) + gui + pixKey + info;
      const category = "52040000";
      const currency = "5303986";
      const amount = "54" + (`${optAmount}`.length < 10 ? "0" + `${optAmount}`.length : `${optAmount}`.length) + optAmount;

      const country = "5802BR";
      let name = "59" + getSafeLength(optName) + optName;
      let city ="60" + getSafeLength(optCity) + optCity;
      const additional = "62070503***";
      const crc16 = "6304";

      const payload =
      format +
      account +
      category +
      currency +
      amount +
      country +
      name +
      city +
      additional +
      crc16;

      let crc = 0xffff;
      let j, i;
      for (i = 0; i < payload.length; i++) {
        const c = payload.charCodeAt(i);
        
        if (c > 255) {
          console.log(`code format is invalid!`);
          await interaction.reply({
            ephemeral: true,
            content: `Error`
          });
          return;
        };

        j = (c ^ (crc >> 8)) & 0xff;
        // TODO quando possivel, analisar se daria para fazer o calculo localmente
        crc = crcs[j] ^ (crc << 8);
      }

      await interaction.reply({
        ephemeral: true,
        content: `Creating your pix request, please wait!`
      });

      const crcCalc = ((crc ^ 0) & 0xffff).toString(16).toUpperCase();
      let qrCodePix = payload + "0".repeat(4 - crcCalc.length) + crcCalc;

      // fetch QR Code
      const size = 280;
      const qrImgRequest = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${qrCodePix}`);
      const bufferImg = await qrImgRequest.arrayBuffer();

      const embed = new EmbedBuilder()
          .setTitle(`Pix Request - ${optName}`)
          .setColor('Random')
          .addFields({ name: 'Value', value: `R$ ${optAmount}`, inline: true }, {name: `Date`, value: (new Date()).toString()})
          .setImage(`attachment://pix.png`);

      interaction.channel.send({ embeds: [embed], files: [{attachment: Buffer.from(bufferImg), name: `pix.png`}] });
    }
    catch(e)
    {
      console.log(e);
      if(!interaction.replied)
      {
        await interaction.reply({
          ephemeral: true,
          content: `Error: ${e}`
        });
      }
    }
  },

  name: 'pix',
  description: 'Send a pix to someone!',
  options: [
    {
      name: 'key',
      description: 'Your pix key',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'name',
      description: 'Your name',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'value',
      description: 'How much you want to pay',
      type: ApplicationCommandOptionType.Number,
      required: true,
      min_value: 0.01
    }, 
    {
      name: 'city',
      description: 'Your city',
      type: ApplicationCommandOptionType.String,
      required: true
    }, 
    {
      name: 'description',
      description: 'Your description',
      type: ApplicationCommandOptionType.String,
    }, 
  ]
}

function getSafeLength(obj) {
  return obj.length < 10 ? "0" + obj.length : obj.length;
}