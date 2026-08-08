import Status from "../../models/status.js";

async function getRandomStatus() {
  const count = await Status.countDocuments();

  if (count > 0) {
    return await Status.findOne().skip(Math.floor(Math.random() * count));
  }

  return null;
}

export default getRandomStatus;
