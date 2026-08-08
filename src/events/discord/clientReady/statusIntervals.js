import getRandomStatus from "../../../utils/components/getRandomStatus.js";
import cache from "../../../cache/activity.js";

let initStatus = true;

const ONE_SEC = 1000;
const TIMEOUT = 15 * ONE_SEC;

export default async (client) => {
  setStatus(client);

  setInterval(async () => await setStatus(client), TIMEOUT);
};

async function setStatus(client) {
  if (cache.rotate() || initStatus) {
    let newStatus = await getRandomStatus();
    initStatus = false;

    if(!newStatus)
    {
      cache.set();
    } else {
      cache.set({
        name: newStatus.title,
        url: newStatus.link,
      });
    }
  }

  client.user.setActivity(cache.get());
}
