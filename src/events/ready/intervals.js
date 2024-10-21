const { ActivityType } = require("discord.js");

module.exports = (client) => {

  let status = [
    {
      name: 'Evt1',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=0UFLPJAp_Cw'
    },
    {
      name: 'Evt2',
      type: ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=QeN2Iv00qDo'
    }
  ];

  let random = Math.floor(Math.random() * status.length);

  setInterval(() => {
    client.user.setActivity(status[random]);
  }, 10000);
}