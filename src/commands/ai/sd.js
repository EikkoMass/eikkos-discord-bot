const { Client, Interaction, ApplicationCommandOptionType, MessageFlags } = require('discord.js');
const { Buffer } = require('node:buffer');
require('dotenv').config();

module.exports =  {
  name: 'sd',
  description: 'send a prompt to stable diffusion',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {

    const imgFormat = "jpeg";
    let prompt = interaction.options.get('prompt')?.value;

    if(!prompt)
    {
      interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        content: 'You need to send an valid input'
      });
      return;
    }

    if(!process.env.STABLE_DIFFUSION_API_KEY)
    {
      interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        content: 'Missing API key'
      });
      return;
    }

    interaction.reply({
      flags: [ MessageFlags.Ephemeral ],
      content: `Generating the image, please wait!`
    });

    const formData = new FormData();
    
    formData.append("prompt", prompt);
    formData.append("output_format", imgFormat);
    
    const response = await fetch(
      `https://api.stability.ai/v2beta/stable-image/generate/sd3`, {
        method: "POST",
        body: formData,
        headers: { 
          Authorization: `Bearer ${process.env.STABLE_DIFFUSION_API_KEY}`, 
          Accept: "image/*" 
        }
    });
        
    if(response.status === 200) {
      interaction.channel.send({
        files: [{attachment: Buffer.from(await response.arrayBuffer()), name: `generated-img.${imgFormat}`}]
      });
    } else {
      throw new Error(`${response.status}: ${response.text}`);
    }

  },
  options: [
    {
      name: 'prompt',
      description: 'the prompt you want to generate',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ]
}