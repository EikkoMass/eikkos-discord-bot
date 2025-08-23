import {Client, ApplicationCommandOptionType, EmbedBuilder, MessageFlags } from 'discord.js';
import crcs from '../../utils/crcs.js';
import Pix from '../../models/pix.js';

export default {

  // Heavily inspired by https://github.com/EnssureIT/faz-um-pix

  callback: async (client, interaction) => {
    switch(interaction.options.getSubcommand())
    {
      case 'request':
        await request(client, interaction);
        break;
      case 'register':
        await register(client, interaction);
        break;
      default:
        await interaction.reply({
          flags: [ MessageFlags.Ephemeral ],
          content: `Pix command not found!`
        });
        return;
    }
  },

  name: 'pix',
  description: 'Send a pix to someone!',
  options: [
    {
      name: 'register',
      description: 'Your account data',
      type: ApplicationCommandOptionType.Subcommand,
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
          name: 'city',
          description: 'Your city',
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    },
    {
      name: 'request',
      description: 'Request a pix to someone',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'value',
          description: 'How much you want to pay',
          type: ApplicationCommandOptionType.Number,
          required: true,
          min_value: 0.01
        },
        {
          name: 'user',
          description: 'user that you want to request the value',
          type: ApplicationCommandOptionType.User,
        },
        {
          name: 'description',
          description: 'Your transaction description',
          type: ApplicationCommandOptionType.String,
        },
      ]
    }
  ]
}

function getSafeLength(obj) {
  return obj.length < 10 ? "0" + obj.length : obj.length;
}

/**
 * 
 * @param {Client} client 
 * @param  interaction 
 */
async function request(client, interaction)
{
  try{
    let userPixData = await Pix.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });

    if(!userPixData) {
      await interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        content: `No user found, try to register your data with /pix register (...)`
      });
      return;
    }

    const optUser = interaction.options.get('user')?.value;
    const optDescription = interaction.options.get('description')?.value || "";
    const optName = userPixData.name.substring(0, 25);
    const optCity = userPixData.city.substring(0, 25);
    const optAmount = interaction.options.get('value')?.value.toFixed(2);

    const format = "000201"; // Payload Format Indicator
    const gui = "0014br.gov.bcb.pix"; // GUI
    
    const pixKey = `01${getSafeLength(userPixData.key) + userPixData.key}`;
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
          flags: [ MessageFlags.Ephemeral ],
          content: `Error`
        });
        return;
      };

      j = (c ^ (crc >> 8)) & 0xff;
      // TODO quando possivel, analisar se daria para fazer o calculo localmente
      crc = crcs[j] ^ (crc << 8);
    }

    await interaction.reply({
      flags: [ MessageFlags.Ephemeral ],
      content: `Creating your pix request, please wait!`
    });

    const crcCalc = ((crc ^ 0) & 0xffff).toString(16).toUpperCase();
    let qrCodePix = payload + "0".repeat(4 - crcCalc.length) + crcCalc;

    // fetch QR Code
    const size = 280;
    const qrImgRequest = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${qrCodePix}`);
    const bufferImg = await qrImgRequest.arrayBuffer();

    const infoFields = [
      { name: 'Value', value: `R$ ${optAmount}`, inline: true }, 
      {name: `Date`, value: (new Date()).toString()}
    ];

    if(optUser) {
      infoFields.push({
        name: 'To User',
        value: `<@${optUser}>`
      })
    }

    const embed = new EmbedBuilder()
        .setTitle(`Pix Request - ${optName}`)
        .setColor('Random')
        .addFields(infoFields)
        .setImage(`attachment://pix.png`);

    interaction.channel.send({ embeds: [embed], files: [{attachment: Buffer.from(bufferImg), name: `pix.png`}] });
  }
  catch(e)
  {
    console.log(e);
    if(!interaction.replied)
    {
      await interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        content: `Error: ${e}`
      });
    }
  }
}

/**
 * 
 * @param {Client} client 
 * @param  interaction 
 */
async function register(client, interaction)
{
  try {
    const key = interaction.options.get('key')?.value;
    const name = interaction.options.get('name')?.value;
    const city = interaction.options.get('city')?.value;
  
    let pixRegister = await Pix.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
  
    if(pixRegister)
    {
      pixRegister.key = key;
      pixRegister.name = name;
      pixRegister.city = city;
  
      await pixRegister.save();
      await interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        content: `Pix data edited successfully!`
      });
      return;
    }
  
    pixRegister = new Pix({
      guildId: interaction.guild.id,
      userId: interaction.user.id,
      key,
      name,
      city,
    });
  
    await pixRegister.save();
  
    await interaction.reply({
      flags: [ MessageFlags.Ephemeral ],
      content: `Pix user info created successfully!`
    });
  } catch (e) {
    console.log(e);
  } 
}