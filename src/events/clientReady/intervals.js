import Stream from "../../models/stream.js";
import cache from "../../utils/cache/activity.js";

export default async (client) => {
  let streams = await Stream.find();

  if (streams) {
    let stream = streams[Math.floor(Math.random() * streams.length)];

    if (stream) {
      cache.set({
        name: stream.title,
        url: stream.link,
      });
    }
  }

  setInterval(() => client.user.setActivity(cache.get()), 10000);
};
