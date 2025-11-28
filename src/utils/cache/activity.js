import { ActivityType } from "discord.js";

let activity = {
  name: "Evt",
  state: "lmao",
  type: ActivityType.Streaming,
  url: "https://www.youtube.com/watch?v=JjjNa8khhww",
};

export function set(activityObj) {
  activity = { ...activity, ...activityObj };
}

export function get() {
  return activity;
}

export default {
  get,
  set,
};
