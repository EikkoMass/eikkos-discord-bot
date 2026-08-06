import getRandomStream from "../../../utils/components/getRandomStream.js";
import cache from "../../../cache/activity.js";

let initStream = true;

const ONE_SEC = 1000;
const TIMEOUT = 15 * ONE_SEC;

export default async (client) => {
  setStream(client);

  setInterval(async () => await setStream(client), TIMEOUT);
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
