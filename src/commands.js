require('dotenv').config();
const {REST, Routes, ApplicationCommandOptionType} = require('discord.js');

const commands = [
  {
    name: 'add',
    description: 'Adds two numbers',
    options: [
      {
        name: 'first-number',
        description: 'The first number',
        type: ApplicationCommandOptionType. Number,
        choices: [
          {name: 'one', value: 1},
          {name: 'two', value: 2},
        ],
        required: true,
      },
      {
        name: 'second-number',
        description: 'The second number',
        type: ApplicationCommandOptionType. Number,
        required: true,
      }
    ]
  }
];

const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
      console.log('registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
      {body: commands}
    );

    console.log('Slash commands registered sucessfully');
  } catch (err)
  {
    console.log(`error: ${err}`);
  }
})()