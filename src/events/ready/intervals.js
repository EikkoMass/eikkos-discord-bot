const { ActivityType } = require("discord.js");
const Stream = require('../../models/stream');

module.exports = async (client) => {

  let stream = await Stream.findOne({ priority: true });

  if(stream)
  {
    stream.priority = false;
    await stream.save();
  } else {
    let streams = await Stream.find();

    if(streams)
    {
      stream = streams[Math.floor(Math.random() * streams.length)];
    }
  }

  setInterval(() => {
    client.user.setActivity({
      name: stream?.title || 'Evt',
      type: ActivityType.Streaming,
      url: stream?.link || 'https://www.youtube.com/watch?v=JjjNa8khhww'
    });
  }, 10000);
}