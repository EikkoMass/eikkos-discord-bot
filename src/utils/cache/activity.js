import { ActivityType } from "discord.js";

let defaultActivity = {
  name: "Evt",
  state: "lmao",
  type: ActivityType.Streaming,
  url: "https://www.youtube.com/watch?v=JjjNa8khhww",
};

let activity = defaultActivity;

export function set(activityObj) {
  if (!activityObj) {
    activity = defaultActivity;
    return;
  }

  activity = { ...activity, ...activityObj };
}

export function get() {
  return activity;
}

export default {
  get,
  set,
};
