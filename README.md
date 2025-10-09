# Eikko's Bot

This is a bot that started the development as a study, now became a hobby project, hope you enjoy too.

[![Discord.JS](https://img.shields.io/badge/Discord.JS-%235865F2.svg?style=for-the-badge&logo=discorddotjs&logoColor=white)](https://discord.js.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%2347A248.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## How to build the project

Make sure you have Node.js installed (last version revised: v22.20.0).

- Create an `.env` file into the project, using the file `.env.example` as a template.
  - [`APP_ID` | `string`]
    - Application Id available on the Discord Developer Portal
  - [`DISCORD_TOKEN` | `string`]
    - Client Secret available on the Discord Developer Portal
  - [`MONGODB_URI` | `string`]
    - Connection string of your MongoDB database
- Create an `config.json` file into the project, using the file `config.json.example` as a template.
  - [`testServer` | `string`]
    - tells the bot the id of the `test server` (filling this field will make the bot register the command **ONLY** into the test server, if you don't want this, just keep as an empty string).
  - [ `devs` | `Array<string>` ]
    - specify to the bot who is the`developer`, important if you want to create debug / experimental commands.
- Inside the main folder, run the command `node src/index.js` or just `npm start`.


## Building a Slash Command

### Required

#### [`name` | `string`]
Name of the command that will be registered on the bot.

#### [`description` | `string`]
Description of the command explaining what it can do.

#### [`callback` | `function`]
The logic structure of the command that will be executed.

----
### Optional

#### [`options` | `Array<object>`]
Recursive array to add subcommands / fields to the command.

#### [ `devOnly` | `boolean`]
Saying that only the `developer` of the bot can run the command.

#### [ `testOnly` | `boolean`]
Specifying to the bot that the command only should run inside a `test server`.

#### [ `deleted` | `boolean` ]
Marking the command to be removed from discord's command cache (recommended if you want to remove the feature from the bot).

#### [ `permissionsRequired` | `Array<PermissionFlagsBits>`]
List of permissions the `user` need to have to run the command.

#### [ `botPermissions` | `Array<PermissionFlagsBits>`]
List of permissions the `bot` need to have to run the command.
