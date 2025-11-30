import getRandomStream from "../../utils/components/getRandomStream.js";
import cache from "../../utils/cache/activity.js";

export default async (client) => {
  let stream = await getRandomStream();
  console.log(stream);
  if (stream) {
    cache.set({
      name: stream.title,
      url: stream.link,
    });
  }

  setInterval(() => client.user.setActivity(cache.get()), 10000);
};
