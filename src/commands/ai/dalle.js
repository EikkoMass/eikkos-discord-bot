import {Client, ApplicationCommandOptionType, MessageFlags} from 'discord.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export default  {
  name: 'dalle',
  description: 'send a prompt to openai\'s dalle',
  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {

    const px = 1024;
    const prompt = interaction.options.get('prompt')?.value;

    if(!prompt)
    {
      interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        content: 'You need to send an valid input'
      });
      return;
    }

    if(!process.env.OPENAI_API_KEY)
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
    
    const response = await (new OpenAI({ OPENAI_API_KEY: process.env.OPENAI_API_KEY })).images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: `${px}x${px}`,
    });
    
    
    if(response) {
      interaction.channel.send(response.data[0].url);
    } else {
      throw new Error(response);
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