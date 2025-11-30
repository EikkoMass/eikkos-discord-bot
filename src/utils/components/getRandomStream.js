import Stream from "../../models/stream.js";

async function getRandomStream() {
  const count = await Stream.countDocuments();

  if (count > 0) {
    return await Stream.findOne().skip(Math.floor(Math.random() * count));
  }

  return null;
}

export default getRandomStream;
