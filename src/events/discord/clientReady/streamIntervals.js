import getRandomStream from "../../../utils/components/getRandomStream.js";
import cache from "../../../utils/cache/activity.js";

let initStream = true;

const TIMEOUT_IN_SEC = 15;

export default async (client) => {
  setStream(client);

  setInterval(async () => await setStream(client), TIMEOUT_IN_SEC * 1000);
};

async function setStream(client) {
  if (cache.rotate() || initStream) {
    const newStream = await getRandomStream();
    initStream = false;

    cache.set({
      name: newStream.title,
      url: newStream.link,
    });
  }

  client.user.setActivity(cache.get());
}
