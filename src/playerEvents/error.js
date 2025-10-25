import { GuildQueue } from "discord-player";

export default {
  name: "error",

  /**
   * @param {GuildQueue} queue
   * @param error
   */
  callback: async (queue, error) => {
    console.log(`General player error: ${error.message}`);
    console.log(error);
  },
};
