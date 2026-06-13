# Eikko's Bot

This is a bot that started the development as a study, now became a hobby project, hope you enjoy too.

[![Discord.JS](https://img.shields.io/badge/Discord.JS-%235865F2.svg?style=for-the-badge&logo=discorddotjs&logoColor=white)](https://discord.js.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%2347A248.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Valkey](https://img.shields.io/badge/Valkey-6983ff.png?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABBCAMAAAC5KTl3AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAnlQTFRFAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7olAIAAAANN0Uk5TABeA2nsTCUe09//2rU4GrJsiHH7v53oPEFDcQwgNU7/19KdIBBiO7Gcmjf7UheHjcgsVX38HldUwEmDJ+eqYLjKu6aA1Axme/NFbBQ5mAiCc8v3XSm7m2VkRzOSJMQE+7qIpO8aMPKTzTB2Z+OVp6CFYbN04fCcWXsf77aiyvD0fqYHgYgzT0qovRs5WHj+Qj2pzunnrV71aGstldi1B3/qKKpLCXLl98F2ElnBU0Buv3kW+KLuwY8BrgotCyE3PSTSdkZO1VYbxoeJv2woUNiyrylxVhbkAAARrSURBVHic3ZdpTBRJFIDrEQWVOEEyHAqzAQSVH/xwJh4krhiSZYgMsqNiZJRBIMaIvxAdFM+soi6ugCuHypGAQUAFlaDx+gGTeOCtmGAiHggo47EED8yCZra6u7p7mu5pptk/m60f1VWvXn2v33vVVdWA/m2B/zwBqDI8doI7kPJpjARQDdGjdg/oHwvBG2CQbXsC2JQS/GF40LHvBdCjhKDBvr8TivywqNNlQhh0S4g18FwyK2LVcBjk7AcLLIcBPBidoIWndt7sZLijmTrQzQki4McdeUIktnmf7egAevELBIbCG44xHytclSHEAFi5ThTABaZlgNfPOLHX1IAmZ4QEgMtsOxagaYgfUumhmevEQ6PDEE9I6gp6zTlgxC9b7WhIZTxnPMV2DJ5guyAipEMP78C8vkDibPKEuyT87mtu8VkxdPRzC4wQ1vEmgyPH9xJPMwAq06GerOik79PKOEZEZKGQEH2L9GMDxhUTL/1NQ5XUcz3UEYMGn2eco4vPSBO8VkEe08rGoSBmMuFtH+P3HFvKHyBL2AQ3mACYQ+Ahlxi8GqOek9Ble/45KEPwf0GkaS02fmXSZSvANqaV3CBDSC1m7Hzz/0I7sFDV9euHBuYr0cXBGXpFh3eNSsiDm5doYUTiu2vtBwDKXzKMZVUPXCIcLmSyl+mXR1KwS53NNGZfd4lQ1EwvrYOQwQVBuzaLfoY9UkCIjalw+I6P/bVHMaHwNJXW8SUArdRqPbpRKcE8KR83K2EDKoHteHdwX1+mkBBiMeOsDlDm03x34vrEOoWE41twHvbuo8ci2nBVs1YhodyEW7Xp9FjlSlxNfzuWd9B10GM7tuKqPlVpHObiDzshiAqfb94KKjc5Cgn6jqe46ZG/GaGqKrxFhg58VUhApiEqD5a5bT6nqZXVkIyUElBKp8O5kBu+WjnB68hRDnH2Xj5STkB/77cQHe9jFVYlhPlbqpntAfkYqX3GMPE7u9/VJrhEQLt/SzrLSOuW4CojnOwOvkdMn10jINQMFnpb2k35cWhWIi08+KSR3npkCfZhN+asUNUtH0HQpfxOTl9ZAnY6NYc+5VLrBQTDgk3kGAr9VrFUloB02/UiwqtDyQXkSlmhaduPJAl6K3sEn/9lBMFbPa2TPWYPn7e9RNIEsxninRCQmRzKcVl2okOVKb1CAi7jpndLE8h8Pzf+frAwGxaxbZ6wJOukusAZITRoZxF3i9Eu/jTPiMQEfGzuuX5KmhDnNqOUU7NXF7U6zBLe5cCanyEmJPm08jextJUnS4RzBD2kOd56gCf89AYnMbcr5WIBO+5rr93XLJwiutMykWcIektiT0z0omjeQKmpb+QEJ3d7hoCCi3oa+YuIJqfmilhVnuBY7C3vDVKqTgjl7WVCgVn9sUb6Z8kJIdfjtiBgLRAvCoA8AS+Onx9z93HrR7XOmZ7cn5o27ge1ywXP0c/UOteS/VvMnTKz+JLntqhdTTJKo/yxPgTQB4r+SZQQXCn/D8I/Y3bWUXIYQSEAAAAASUVORK5CYII=&logoColor=white)](https://www.valkey.io/)

## How to build the project

- Create an `.env` file into the project, using the file `.env.example` as a template.
  - [`APP_ID` | `string`]
    - Application Id available on the Discord Developer Portal
  - [`DISCORD_TOKEN` | `string`]
    - Client Secret available on the Discord Developer Portal
  - [`MONGODB_URI` | `string`]
    - Connection string of your MongoDB database
  - [`VALKEY_HOST` | `string`]
    - Connection IP of your Valkey database
  - [`VALKEY_PORT` | `number`]
    - Port of your Valkey database
- Create an `config.json` file into the project, using the file `config.json.example` as a template.
  - [`testServer` | `string`]
    - tells the bot the id of the `test server` (filling this field will make the bot register the command **ONLY** into the test server, if you don't want this, just keep as an empty string).
  - [ `devs` | `Array<string>` ]
    - specify to the bot who is the `developer`, important if you want to create debug / experimental commands.
  - [ `emojis` | `object` ]
    - specify the name and the id of the emojis that you want to use in the bot.

### Running Locally

Make sure you have Node.js installed (last version revised: v24.13.0).

Inside the main folder, run the command `node src/index.js` or just `npm start`.

### Running with Docker

Inside the main folder, run the command to build the Dockerfile:

`docker build -t eikkos-discord-bot .`

after that, create a new container with the command:

`docker run --name bot -p 80:80 eikkos-discord-bot`

your container must be already running, you can manage the bot execution with the commands:

`docker start bot`
`docker stop bot`

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
