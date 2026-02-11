import { GuildQueue } from "discord-player";

export default {
  name: "playerError",

  /**
   * @param {GuildQueue} queue
   * @param error
   */
  callback: async (queue, error) => {
    console.log(`Player error: ${error.message}`);
    console.log(error);
  },
};
