const {Client, Interaction, ApplicationCommandOptionType} = require('discord.js');
const OpenAI = require('openai');
require('dotenv').config();

module.exports =  {
  name: 'sd',
  description: 'send a prompt to openai\'s dalle',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {

    const px = 1024;
    const prompt = interaction.options.get('prompt')?.value;
    const scale = interaction.options.get('scale')?.value || 1;

    if(!prompt)
    {
      interaction.reply({
        ephemeral: true,
        content: 'You need to send an valid input'
      });
      return;
    }

    if(!process.env.OPENAI_API_KEY)
    {
      interaction.reply({
        ephemeral: true,
        content: 'Missing API key'
      });
      return;
    }

    interaction.reply({
      ephemeral: true,
      content: `Generating the image, please wait!`
    });
    
    const size = px * scale;

    const response = await (new OpenAI({ OPENAI_API_KEY: process.env.OPENAI_API_KEY })).images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: `${size}x${size}`,
    });
    
    console.log(response.status);

    if(response.status === 200) {
      interaction.channel.send(response.data[0].url);
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }

  },
  options: [
    {
      name: 'prompt',
      description: 'the prompt you want to generate',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'scale',
      description: 'scale size',
      type: ApplicationCommandOptionType.Integer,
    }
  ]
}